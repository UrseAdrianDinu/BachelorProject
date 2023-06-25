import { Component, OnInit } from '@angular/core';
import { IPerson } from '../person.model';
import { EntityArrayResponseType, PersonService } from '../service/person.service';
import { SortService } from '../../../shared/sort/sort.service';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonDeleteDialogComponent } from '../delete/person-delete-dialog.component';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from '../../../config/navigation.constants';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { AccountExt } from '../../../core/auth/account-ext.model';
import { ICompany } from '../../company/company.model';
import { AccountService } from '../../../core/auth/account.service';
import { defaultIfEmpty, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPersonUser } from './person-user.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Component({
  selector: 'jhi-list-company-people',
  templateUrl: './list-company-people.component.html',
  styleUrls: ['./list-company-people.component.scss'],
})
export class ListCompanyPeopleComponent implements OnInit {
  people?: IPerson[];
  isLoading = false;
  predicate = 'id';
  ascending = true;
  peopleUser?: IPersonUser[];

  private readonly destroy$ = new Subject<void>();
  account: AccountExt | null = null;
  person!: IPerson | null;
  isAdmin: boolean = false;
  company: ICompany | null = null;
  constructor(
    protected personService: PersonService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) {}

  // trackId = (_index: number, item: IPerson): number => this.personService.getPersonIdentifier(item);
  trackId = (_index: number, item: IPersonUser): number => item.personDTO.id!;

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
            this.loadPeopleUser();
          });
        },
        error => {
          // Handle errors from either API call
          console.error(error);
        }
      );
  }

  delete(person: IPerson): void {
    const modalRef = this.modalService.open(PersonDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.person = person;
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

  deletePersonUser(person: IPersonUser): void {
    const modalRef = this.modalService.open(PersonDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.person = person;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformationsPeopleUser())
      )
      .subscribe({
        next: (res: HttpResponse<IPersonUser[]>) => {
          this.onResponseSuccessPeopleUser(res);
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

  loadPeopleUser(): void {
    this.loadFromBackendWithRouteInformationsPeopleUser().subscribe({
      next: (res: HttpResponse<IPersonUser[]>) => {
        this.onResponseSuccessPeopleUser(res);
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

  protected loadFromBackendWithRouteInformationsPeopleUser(): Observable<HttpResponse<IPersonUser[]>> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackendPersonUser(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.people = this.refineData(dataFromBody);
  }

  protected onResponseSuccessPeopleUser(response: HttpResponse<IPersonUser[]>): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBodyPersonUser(response.body);
    this.peopleUser = this.refineDataPeopleUser(dataFromBody);
  }

  protected refineData(data: IPerson[]): IPerson[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected refineDataPeopleUser(data: IPersonUser[]): IPersonUser[] {
    const personFields: string[] = [
      'id',
      'code',
      'phoneNumber',
      'salary',
      'status',
      'hireDate',
      'dateOfBirth',
      'streetAddress',
      'postalCode',
      'city',
      'region',
      'country',
      'user',
      'manager',
      'teams',
      'department',
      'role',
    ];

    if (personFields.includes(this.predicate)) {
      return data.sort(this.sortService.startSortPeopleUser(this.predicate, 'person', this.ascending ? 1 : -1));
    } else {
      return data.sort(this.sortService.startSortPeopleUser(this.predicate, 'user', this.ascending ? 1 : -1));
    }
  }

  protected fillComponentAttributesFromResponseBody(data: IPerson[] | null): IPerson[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseBodyPersonUser(data: IPersonUser[] | null): IPersonUser[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.personService.queryByCompany(this.company!.id, queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected queryBackendPersonUser(predicate?: string, ascending?: boolean): Observable<HttpResponse<IPersonUser[]>> {
    this.isLoading = true;
    const queryObject = {
      eagerload: false,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.personService.queryPeopleUserByCompany(this.company!.id, queryObject).pipe(tap(() => (this.isLoading = false)));
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
}
