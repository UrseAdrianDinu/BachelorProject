import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineLatest, filter, Observable, switchMap, tap, flatMap, defaultIfEmpty, of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { AccountExt } from '../core/auth/account-ext.model';
import { PersonService } from '../entities/person/service/person.service';
import { IPerson } from '../entities/person/person.model';
import { ICompany } from '../entities/company/company.model';
import { IRole } from '../entities/role/role.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: AccountExt | null = null;
  private readonly destroy$ = new Subject<void>();

  isAdmin?: boolean = false;

  person!: IPerson | null;

  company!: ICompany | null;

  role!: IRole | null;

  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;

  isInitialized: boolean = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private accountService: AccountService,
    private router: Router,
    private loginService: LoginService,
    private personService: PersonService
  ) {
    this.isAdmin = false;
  }
  ngOnInit(): void {
    // this.accountService
    //   .getAuthenticationState()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(account => (this.account = account));
    // this.accountService
    //   .getAuthenticationState()
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     tap(account => (this.account = account)),
    //     defaultIfEmpty(null),
    //     filter(account => account !== null),
    //     flatMap(account => {
    //       // Make another API call using the information from the first call
    //       //this.isAdmin = this.account!.login == "admin";
    //
    //       if(account!.login !== 'admin')
    //         return this.personService.getPersonByUser(this.account!.id);
    //       else {
    //         // Return an observable that emits null
    //         this.isAdmin = true;
    //         this.accountService.setIsAdmin(true);
    //         return of(null);
    //       }
    //
    //     })
    //   )
    // .subscribe(
    //     person => {
    //       // Handle the result of the second API call
    //       this.person = person?.body!;
    //     },
    //     error => {
    //       // Handle errors from either API call
    //       console.error(error);
    //     }
    // //   );
    // this.accountService
    //   .getAuthenticationState()
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     tap(account => (this.account = account)),
    //     defaultIfEmpty(null),
    //     filter(account => account !== null),
    //     flatMap(account => {
    //       // Make another API call using the information from the first call
    //       //this.isAdmin = this.account!.login == "admin";
    //
    //       if(account!.login !== 'admin')
    //         return this.personService.getPersonByUser(this.account!.id);
    //       else {
    //         // Return an observable that emits null
    //         this.isAdmin = true;
    //         this.accountService.setIsAdmin(true);
    //         return of(null);
    //       }
    //     })
    //   )
    //   .subscribe(
    //     person => {
    //       // Handle the result of the second API call
    //       this.person = person?.body!;
    //       console.log(this.person?.id);
    //       this.personService.getPersonCompany(this.person?.id!).subscribe(
    //         company => {
    //           this.company = company?.body!;
    //           this.personService.getPersonRole(this.person?.id!).subscribe(
    //             role => {
    //               this.role = role?.body!;
    //               this.isInitialized = true;
    //             });
    //         });
    //     },
    //     error => {
    //       // Handle errors from either API call
    //       console.error(error);
    //     }
    //   );

    // this.accountService
    //   .getAuthenticationState()
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     tap(account => (this.account = account)),
    //     defaultIfEmpty(null),
    //     filter(account => account !== null),
    //     flatMap(account => {
    //       if (account!.login !== 'admin') {
    //         return this.personService.getPersonByUser(this.account!.id);
    //       } else {
    //         this.isAdmin = true;
    //         this.accountService.setIsAdmin(true);
    //         return of(null);
    //       }
    //     }),
    //     flatMap(person => {
    //       this.person = person?.body!;
    //       console.log(this.person?.id);
    //
    //       const company$ = this.personService.getPersonCompany(this.person?.id!);
    //       const role$ = this.personService.getPersonRole(this.person?.id!);
    //
    //       return forkJoin([of(person), company$, role$]);
    //     })
    //   )
    //   .subscribe(
    //     ([person, company, role]) => {
    //       this.person = person?.body!;
    //       this.company = company?.body!;
    //       this.role = role?.body!;
    //       this.isInitialized = true;
    //     },
    //     error => {
    //       console.error(error);
    //     }
    //   );

    this.accountService
      .getAuthenticationState()
      .pipe(
        takeUntil(this.destroy$),
        tap(account => (this.account = account)),
        defaultIfEmpty(null),
        filter(account => account !== null),
        flatMap(account => {
          if (account!.login !== 'admin') {
            return this.personService.getPersonByUser(this.account!.id).pipe(
              flatMap(person => {
                this.person = person.body!;
                const company$ = this.personService.getPersonCompany(this.person.id);
                const role$ = this.personService.getPersonRole(this.person.id);
                return forkJoin([of(person), company$, role$]);
              })
            );
          } else {
            this.isAdmin = true;
            this.accountService.setIsAdmin(true);
            return of([null, null, null]);
          }
        })
      )
      .subscribe(([person, company, role]) => {
        if (person) {
          this.person = person.body ?? null;
          this.company = company?.body ?? null;
          this.role = role?.body ?? null;
          this.isInitialized = true;
        }
      });
  }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError = false;
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.accountService.setIsAdmin(this.loginForm.getRawValue().username === 'admin');
          this.isAdmin = this.accountService.getIsAdmin();
          this.router.navigate(['']);
        }
      },
      error: () => (this.authenticationError = true),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goRegisterPage(): void {
    this.router.navigate(['company/register']);
  }
}
