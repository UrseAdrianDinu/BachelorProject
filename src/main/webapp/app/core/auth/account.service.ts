import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of, combineLatest } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { switchMap, concatMap, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';
import { AccountExt } from './account-ext.model';
import { IPerson } from '../../entities/person/person.model';
import { PersonService } from '../../entities/person/service/person.service';
import { Subject } from 'rxjs';
interface AccountCache {
  account: Account | null;
  person: IPerson | null;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private userExt: AccountExt | null = null;
  private authenticationState = new ReplaySubject<AccountExt | null>(1);
  private accountCache$?: Observable<AccountExt> | null;
  private isAdmin: boolean = false;
  person!: IPerson | null;

  private buttonClickedSubject = new Subject<void>();

  buttonClicked$ = this.buttonClickedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService,
    private personService: PersonService
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    if (!identity) {
      this.authenticationState.next(null);
    } else {
      this.authenticationState.next(this.userExt);
    }
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: AccountExt) => {
          let curr: Account = new Account(
            account.activated,
            account.authorities,
            account.email,
            account.firstName,
            account.langKey,
            account.lastName,
            account.login,
            account.imageUrl
          );
          if (account.login == 'admin') this.setIsAdmin(true);
          this.userExt = account;
          this.authenticate(curr);

          this.navigateToStoredUrl();

          this.personService.getPersonByUser(account!.id).subscribe(person => {
            // Do something with the person object, such as assigning it to a class property
            this.person = person?.body;
          });
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));
  }

  setIsAdmin(value: boolean) {
    this.isAdmin = value;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getPerson() {
    return this.person;
  }

  getUserExt() {
    return this.userExt;
  }
  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<AccountExt | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<AccountExt> {
    return this.http.get<AccountExt>(this.applicationConfigService.getEndpointFor('api/account'));
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }

  triggerButtonClicked() {
    this.buttonClickedSubject.next();
  }
}
