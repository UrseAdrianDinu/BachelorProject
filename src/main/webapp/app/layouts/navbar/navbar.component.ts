import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap, of } from 'rxjs';
import { VERSION } from 'app/app.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { AccountExt } from '../../core/auth/account-ext.model';
import { IPerson } from '../../entities/person/person.model';
import { PersonService } from '../../entities/person/service/person.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: AccountExt | null = null;
  isAdmin?: boolean = false;
  entitiesNavbarItems: any[] = [];
  person!: IPerson | null;
  private subscription: Subscription | undefined;

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private personService: PersonService,
    private router: Router
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }

    this.subscription = this.accountService.buttonClicked$.subscribe(() => {
      this.accountService
        .getAuthenticationState()
        .pipe(
          tap(account => {
            this.account = account;
            this.isAdmin = this.account?.login === 'admin';
            this.accountService.setIsAdmin(this.isAdmin);
          }),
          switchMap(account => {
            if (account && !this.isAdmin) {
              return this.personService.getPersonByUser(account.id);
            } else {
              return of(null); // Emit null if account is null
            }
          })
        )
        .subscribe(person => {
          this.person = person?.body ?? null;
          // Code to execute after the person is fetched
        });
    });
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    // this.accountService.getAuthenticationState().subscribe(account => {
    //   this.account = account;
    //   this.isAdmin = this.account?.login == "admin";
    //   this.accountService.setIsAdmin(this.isAdmin);
    //
    //   this.personService.getPersonByUser(this.account!.id).subscribe(person => {
    //     this.person = person?.body;
    //   });
    // });

    this.accountService
      .getAuthenticationState()
      .pipe(
        tap(account => {
          this.account = account;
          this.isAdmin = this.account?.login === 'admin';
          this.accountService.setIsAdmin(this.isAdmin);
        }),
        switchMap(account => {
          if (account && !this.isAdmin) {
            return this.personService.getPersonByUser(account.id);
          } else {
            return of(null); // Emit null if account is null
          }
        })
      )
      .subscribe(person => {
        this.person = person?.body ?? null;
        // Code to execute after the person is fetched
      });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
    this.accountService.setIsAdmin(false);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
