import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { filter, tap, flatMap, defaultIfEmpty, of } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { AccountExt } from '../core/auth/account-ext.model';
import { PersonService } from '../entities/person/service/person.service';
import { IPerson } from '../entities/person/person.model';
import { ICompany } from '../entities/company/company.model';
import { IRole } from '../entities/role/role.model';
import { forkJoin } from 'rxjs';
import { RoleCount } from '../entities/company/service/role-count.model';
import { CompanyService } from '../entities/company/service/company.service';
import { Chart, registerables } from 'chart.js/auto';
import { DepartmentCount } from '../entities/company/service/department-count.model';
import { ProjectCount } from '../entities/company/service/project-count.model';
import { ProjectEVA } from '../entities/company/service/projectEVA.model';

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

  canViewGraphs: boolean = false;

  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;

  isInitialized: boolean = false;

  roleDistribution: RoleCount[] = [];

  departmentDistribution: DepartmentCount[] = [];

  projectDistribution: ProjectCount[] = [];

  projectsEVA: ProjectEVA[] = [];

  public chartRoleDistribution: any;
  @ViewChild('roleDistribution') chartCanvasRoleDistribution!: ElementRef<HTMLCanvasElement>;

  public chartDepartmentDistribution: any;
  @ViewChild('departmentDistribution') chartCanvasDepartmentDistribution!: ElementRef<HTMLCanvasElement>;

  public chartProjectDistribution: any;
  @ViewChild('projectDistribution') chartCanvasProjectDistribution!: ElementRef<HTMLCanvasElement>;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private accountService: AccountService,
    private router: Router,
    private loginService: LoginService,
    private personService: PersonService,
    private companyService: CompanyService
  ) {
    this.isAdmin = false;
  }

  ngOnInit(): void {
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
          if (
            this.role?.name === 'Chief Executive Officer' ||
            this.role?.name === 'Chief Technical Officer' ||
            this.role?.name === 'Chief Human Resources Officer' ||
            this.role?.name === 'Chief Operating Officer'
          ) {
            this.canViewGraphs = true;
          }
          this.isInitialized = true;
          this.companyService.getRoleDistribution(this.company!.id).subscribe(data => {
            this.roleDistribution = data.body!;
            Chart.register(...registerables);
            const ctx = this.chartCanvasRoleDistribution.nativeElement.getContext('2d');
            this.chartRoleDistribution = new Chart(ctx!, {
              type: 'pie',
              data: {
                labels: this.roleDistribution.map(x => x.roleName),
                datasets: [
                  {
                    label: 'Count',
                    data: this.roleDistribution.map(x => x.count),
                    hoverOffset: 4,
                    spacing: 0,
                  },
                ],
              },
              options: {
                aspectRatio: 3,
                plugins: {
                  legend: {
                    position: 'right',
                    align: 'center',
                    display: true,
                  },
                },
              },
            });

            this.companyService.getDepartmentDistribution(this.company!.id).subscribe(dataDepartmentDistribution => {
              this.departmentDistribution = dataDepartmentDistribution.body!;

              const context1 = this.chartCanvasDepartmentDistribution.nativeElement.getContext('2d');
              const roleColors = this.departmentDistribution.map(() => {
                const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                return `#${randomColor}`;
              });
              this.chartDepartmentDistribution = new Chart(context1!, {
                type: 'bar',
                data: {
                  labels: this.departmentDistribution.map(x => x.departmentName),
                  datasets: [
                    {
                      label: 'Count',
                      data: this.departmentDistribution.map(x => x.count),
                      backgroundColor: roleColors,
                      borderColor: roleColors,
                    },
                  ],
                },
                options: {
                  indexAxis: 'y',
                  aspectRatio: 3,
                  plugins: {
                    legend: {
                      position: 'right',
                      align: 'center',
                      display: true,
                    },
                  },
                },
              });

              this.companyService.getProjectDistribution(this.company!.id).subscribe(dataProjectDistr => {
                this.projectDistribution = dataProjectDistr.body!;

                const context2 = this.chartCanvasProjectDistribution.nativeElement.getContext('2d');
                const projectColors = this.projectDistribution.map(() => {
                  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                  return `#${randomColor}`;
                });
                this.chartProjectDistribution = new Chart(context2!, {
                  type: 'bar',
                  data: {
                    labels: this.projectDistribution.map(x => x.projectName),
                    datasets: [
                      {
                        label: 'Count',
                        data: this.projectDistribution.map(x => x.count),
                        backgroundColor: projectColors,
                        borderColor: projectColors,
                      },
                    ],
                  },
                  options: {
                    indexAxis: 'y',
                    aspectRatio: 3,
                    plugins: {
                      legend: {
                        position: 'right',
                        align: 'center',
                        display: true,
                      },
                    },
                  },
                });

                this.companyService.getProjectsEva(this.company!.id).subscribe(dataRes => {
                  this.projectsEVA = dataRes.body!;
                });
              });
            });
          });
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
