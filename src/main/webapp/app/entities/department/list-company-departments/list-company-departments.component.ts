import { Component, OnInit } from '@angular/core';
import { IDepartment } from '../department.model';
import { DepartmentService, EntityArrayResponseType } from '../service/department.service';
import { SortService } from '../../../shared/sort/sort.service';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from '../../../config/navigation.constants';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, combineLatest, tap, switchMap } from 'rxjs';
import { DepartmentDeleteDialogComponent } from '../delete/department-delete-dialog.component';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { AccountExt } from '../../../core/auth/account-ext.model';
import { defaultIfEmpty, flatMap } from 'rxjs/operators';
import { PersonService } from '../../../entities/person/service/person.service';
import { of } from 'rxjs';
import { IPerson } from '../../person/person.model';
import { ICompany } from '../../company/company.model';

@Component({
  selector: 'jhi-list-company-departments',
  templateUrl: './list-company-departments.component.html',
  styleUrls: ['./list-company-departments.component.scss'],
})
export class ListCompanyDepartmentsComponent implements OnInit {
  departments?: IDepartment[];
  isLoading = false;
  predicate = 'id';
  ascending = true;

  private readonly destroy$ = new Subject<void>();
  account: AccountExt | null = null;
  person!: IPerson | null;
  isAdmin: boolean = false;
  company: ICompany | null = null;
  constructor(
    protected departmentService: DepartmentService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected personService: PersonService
  ) {}

  trackId = (_index: number, item: IDepartment): number => this.departmentService.getDepartmentIdentifier(item);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(
        takeUntil(this.destroy$),
        tap(account => (this.account = account)),
        defaultIfEmpty(null),
        filter(account => account !== null),
        flatMap(account => {
          // Make another API call using the information from the first call
          //this.isAdmin = this.account!.login == "admin";

          if (account!.login !== 'admin') return this.personService.getPersonByUser(this.account!.id);
          else {
            // Return an observable that emits null
            this.isAdmin = true;
            this.accountService.setIsAdmin(true);
            return of(null);
          }
        })
      )
      .subscribe(
        person => {
          // Handle the result of the second API call
          this.person = person?.body!;
          console.log(this.person?.id);
          this.personService.getPersonCompany(this.person?.id!).subscribe(company => {
            this.company = company?.body!;
            console.log(this.company?.id);
            this.load();
          });
        },
        error => {
          // Handle errors from either API call
          console.error(error);
        }
      );
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.departments = this.refineData(dataFromBody);
  }

  protected refineData(data: IDepartment[]): IDepartment[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IDepartment[] | null): IDepartment[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.departmentService.queryByCompany(this.company!.id!, queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  delete(department: IDepartment): void {
    const modalRef = this.modalService.open(DepartmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.department = department;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  redirectToDepartment(departmentId: number) {
    this.router.navigate(['/department', departmentId, 'view']);
  }
}
