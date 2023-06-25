import { Component, OnInit } from '@angular/core';
import { IProject } from '../project.model';
import { ProjectDeleteDialogComponent } from '../delete/project-delete-dialog.component';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from '../../../config/navigation.constants';
import { EntityArrayResponseType, ProjectService } from '../service/project.service';
import { SortService } from '../../../shared/sort/sort.service';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { ICompany } from '../../company/company.model';
import { AccountExt } from '../../../core/auth/account-ext.model';
import { IPerson } from '../../person/person.model';
import { Subject } from 'rxjs';
import { DepartmentService } from '../../department/service/department.service';
import { AccountService } from '../../../core/auth/account.service';
import { PersonService } from '../../person/service/person.service';
import { takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { defaultIfEmpty, flatMap } from 'rxjs/operators';

@Component({
  selector: 'jhi-list-company-projects',
  templateUrl: './list-company-projects.component.html',
  styleUrls: ['./list-company-projects.component.scss'],
})
export class ListCompanyProjectsComponent implements OnInit {
  projects?: IProject[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  private readonly destroy$ = new Subject<void>();
  account: AccountExt | null = null;
  person!: IPerson | null;
  isAdmin: boolean = false;
  company: ICompany | null = null;

  constructor(
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected personService: PersonService
  ) {}

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
          this.personService.getPersonCompany(this.person?.id!).subscribe(company => {
            this.company = company?.body!;
            this.load();
          });
        },
        error => {
          // Handle errors from either API call
          console.error(error);
        }
      );
  }

  trackId = (_index: number, item: IProject): number => this.projectService.getProjectIdentifier(item);

  delete(project: IProject): void {
    const modalRef = this.modalService.open(ProjectDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.project = project;
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
    this.projects = this.refineData(dataFromBody);
  }

  protected refineData(data: IProject[]): IProject[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IProject[] | null): IProject[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.projectService.queryByCompany(this.company!.id!, queryObject).pipe(tap(() => (this.isLoading = false)));
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

  redirectToProject(projectId: number) {
    this.router.navigate(['/project', projectId, 'info']);
  }
}
