import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProject } from '../project.model';
import { IPhase } from '../../phase/phase.model';
import { ProjectService } from '../service/project.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PhaseService } from '../../phase/service/phase.service';
import { switchMap } from 'rxjs/operators';
import { ITeam } from '../../team/team.model';
import { TeamService } from '../../team/service/team.service';
import { ISprint, NewSprint } from '../../sprint/sprint.model';
import { IRisk, NewRisk } from '../../risk/risk.model';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskService } from '../../risk/service/risk.service';
import { ProbabilityValue } from '../../enumerations/probability-value.model';
import { of } from 'rxjs';
import { SprintService } from '../../sprint/service/sprint.service';
import { PhaseStatus } from '../../enumerations/phase-status.model';
import { IPerson } from '../../person/person.model';
import { IPersonUser } from '../../person/list-company-people/person-user.model';
import { PersonService } from '../../person/service/person.service';
import { IPersonUserRole } from '../../person/list-company-people/person-user-role.model';
import { ITask, NewTask } from '../../task/task.model';
import { TaskService } from '../../task/service/task.service';
import { AccountService } from '../../../core/auth/account.service';
import { Account } from '../../../core/auth/account.model';
import { AccountExt } from '../../../core/auth/account-ext.model';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { flatMap } from 'rxjs/operators';
import { ICompany } from '../../company/company.model';
import { filter } from 'rxjs/operators';
import dayjs from 'dayjs';
import { EditTask } from '../../task/service/task-edit.model';
import { IRole } from '../../role/role.model';

@Component({
  selector: 'jhi-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  project: IProject | null = null;
  togglePhases: boolean = false;
  toggleTeams: boolean = false;
  phases: IPhase[] = [];
  teams: ITeam[] = [];
  risks: IRisk[] | null = null;
  sprints: ISprint[] | null = null;
  activePhase: IPhase | undefined;
  selectedPhase: string | undefined;
  selectedProbability: string = '';
  selectedStatus: string = '';
  selectedEditTaskStatus: string = '';
  selectedEditMember: string = '';
  selectedDisplayPhase: IPhase | undefined;
  displayObject: string = '';
  selectedDisplayTeam: ITeam | undefined;
  teamPeople: IPersonUserRole[] = [];
  selectedMember: string = '';
  companyPeople: IPersonUser[] = [];
  selectedDisplaySprint: ISprint | undefined;
  sprintTasks: ITask[] = [];
  selectedTaskPriority: string = '';
  selectedEditTaskPriority: string = '';
  selectedSprintStatus: string = '';
  selectedTaskAssignee: string = '';
  selectedEditTaskAssignee: string = '';

  projectPeople: IPersonUser[] = [];
  selectedPersonForTask: string = '';
  selectedTaskDisplayPriority: string = 'ALL';
  selectedTaskDislayStatus: string = 'ALL';
  inprogressTasks: ITask[] = [];
  toDoTasks: ITask[] = [];
  codeReviewTasks: ITask[] = [];
  readyForQaTasks: ITask[] = [];
  doneTasks: ITask[] = [];
  displayTasks: ITask[] = [];

  person!: IPerson | null;
  role!: IRole | null;
  company!: ICompany | null;

  account: AccountExt | null = null;
  private readonly destroy$ = new Subject<void>();

  createFormPhase = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    objective: new FormControl('', {
      validators: [Validators.required],
    }),
    description: new FormControl(''),
    startDate: new FormControl(''),
    estimatedTime: new FormControl(0),
  });

  createFormTeam = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  createFormRisk = new FormGroup({
    description: new FormControl('', {
      validators: [Validators.required],
    }),
    probability: new FormControl('', {
      validators: [],
    }),
    impact: new FormControl('', {
      validators: [],
    }),
  });

  createFormSprint = new FormGroup({
    number: new FormControl(0, {
      validators: [Validators.required],
    }),
    goal: new FormControl('', {
      validators: [],
    }),
    status: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  addFormMember = new FormGroup({
    member: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  createFormTask = new FormGroup({
    title: new FormControl('', {
      nonNullable: false,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      validators: [],
    }),
    startDate: new FormControl(''),
    estimatedTime: new FormControl('', {
      validators: [Validators.required],
    }),
    storyPoints: new FormControl('', {
      validators: [Validators.required],
    }),
    priority: new FormControl('', {
      validators: [Validators.required],
    }),
    assignee: new FormControl('', {
      validators: [Validators.required],
    }),
    reporter: new FormControl(''),
  });

  editFormTask = new FormGroup({
    title: new FormControl('', {
      nonNullable: false,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      validators: [],
    }),
    estimatedTime: new FormControl('', {
      validators: [Validators.required],
    }),
    timeLogged: new FormControl('', {
      validators: [Validators.required],
    }),
    storyPoints: new FormControl('', {
      validators: [Validators.required],
    }),
    priority: new FormControl('', {
      validators: [Validators.required],
    }),
    status: new FormControl('', {
      validators: [Validators.required],
    }),
    assignee: new FormControl('', {
      validators: [Validators.required],
    }),
    reporter: new FormControl(''),
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected projectService: ProjectService,
    protected phaseService: PhaseService,
    protected teamService: TeamService,
    protected riskService: RiskService,
    protected sprintService: SprintService,
    protected personService: PersonService,
    protected taskService: TaskService,
    private modalService: NgbModal,
    private accountService: AccountService
  ) {}

  selectedTab: string = 'sprints';

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
            return of([null, null, null]);
          }
        })
      )
      .subscribe(([person, company, role]) => {
        if (person) {
          this.person = person.body ?? null;
          this.role = role?.body ?? null;
          this.company = company?.body ?? null;

          this.activatedRoute.data
            .pipe(
              switchMap(({ project }) => {
                this.project = project;
                return forkJoin([
                  this.projectService.getProjectPhases(this.project!.id),
                  this.projectService.getProjectTeams(this.project!.id),
                ]);
              }),
              switchMap(([phases, teams]) => {
                this.phases = phases.body!;
                this.activePhase = this.phases.find(phase => phase.status === 'ACTIVE');
                this.teams = teams.body!;
                this.selectedDisplayPhase = this.activePhase;
                if (this.activePhase) {
                  return forkJoin([
                    this.phaseService.findPhaseRisks(this.activePhase.id),
                    this.phaseService.findPhaseSprints(this.activePhase.id),
                  ]).pipe(
                    map(([risks, sprints]) => ({
                      risks: risks.body!,
                      sprints: sprints.body!,
                    }))
                  );
                } else {
                  return of({ risks: null, sprints: null });
                }
              })
            )
            .subscribe(({ risks, sprints }) => {
              if (this.activePhase) {
                this.risks = risks;
                this.sprints = sprints;
              } else {
                // console.log('activePhase is null');
              }
            });
        }
      });
  }

  previousState(): void {
    window.history.back();
  }

  openModalPhase(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
      result => {
        if (result === 'save') {
          // Handle form submission
          if (this.createFormPhase.valid) {
            // Form is valid, do something with the form data
            this.phaseService
              .createPhaseProject(this.createFormPhase.getRawValue(), this.project!.id)
              .pipe(switchMap(() => this.projectService.getProjectPhases(this.project!.id)))
              .subscribe(res => {
                this.phases = res.body!;
              });
          }
        }
      },
      reason => {
        // Modal dismissed
      }
    );
  }

  openModalTeam(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
      result => {
        if (result === 'save') {
          // Handle form submission
          if (this.createFormTeam.valid) {
            // Form is valid, do something with the form data

            this.teamService
              .createTeamProject(this.createFormTeam.getRawValue(), this.project!.id)
              .pipe(switchMap(() => this.projectService.getProjectTeams(this.project!.id)))
              .subscribe(res => {
                this.teams = res.body!;
              });
          }
        }
      },
      reason => {
        // Modal dismissed
      }
    );
  }

  selectChangeHandlerPhase($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedPhase = target?.value;
  }

  setActivePhase() {
    this.phaseService.setPhaseActive(parseInt(this.selectedPhase!, 10)).subscribe(res => {
      this.activePhase = res.body!;
    });
  }

  addRisk(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
      result => {
        if (result === 'save') {
          // Handle form submission
          if (this.createFormRisk.valid) {
            // Form is valid, do something with the form data
            this.riskService
              .createRiskPhase(this.createFormRisk.getRawValue() as NewRisk, this.selectedDisplayPhase!.id)
              .pipe(switchMap(() => this.phaseService.findPhaseRisks(this.selectedDisplayPhase!.id)))
              .subscribe(res => {
                this.risks = res.body!;
              });
          }
        }
      },
      reason => {
        // Modal dismissed
      }
    );
  }

  addSprint(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
      result => {
        if (result === 'save') {
          // Handle form submission
          if (this.createFormSprint.valid) {
            // Form is valid, do something with the form data
            this.sprintService
              .createSprintPhase(this.createFormSprint.getRawValue() as NewSprint, this.selectedDisplayPhase!.id)
              .pipe(switchMap(() => this.phaseService.findPhaseSprints(this.selectedDisplayPhase!.id)))
              .subscribe(res => {
                this.sprints = res.body!;
              });
          }
        }
      },
      reason => {
        // Modal dismissed
      }
    );
  }

  selectChangeHandlerProbability($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedProbability = target?.value;
  }

  getProbabilityClass(probability: string | null | undefined): string {
    if (probability === 'HIGH') {
      return 'high-probability';
    } else if (probability === 'MEDIUM') {
      return 'medium-probability';
    } else if (probability === 'LOW') {
      return 'low-probability';
    } else {
      return '';
    }
  }

  getPriorityClass(probability: string | null | undefined): string {
    if (probability === 'HIGH') {
      return 'high-priority';
    } else if (probability === 'MEDIUM') {
      return 'medium-priority';
    } else if (probability === 'LOW') {
      return 'low-probability';
    } else if (probability === 'LOWEST') {
      return 'low-probability';
    } else if (probability === 'HIGHEST') {
      return 'highest-priority';
    } else {
      return '';
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  getStatusClass(status: string | null | undefined): string {
    if (status === 'ACTIVE') {
      return 'status-active';
    } else if (status === 'CLOSED') {
      return 'status-closed';
    } else if (status === 'FUTURE') {
      return 'status-future';
    }
    return '';
  }

  setSelectedPhase(phase: IPhase) {
    this.selectedDisplayPhase = phase;
    this.displayObject = 'phase';
    this.phaseService.findPhaseRisks(phase.id).subscribe(res => {
      this.risks = res.body!;
      this.phaseService.findPhaseSprints(phase.id).subscribe(res => {
        this.sprints = res.body!;
      });
    });
  }

  protected readonly PhaseStatus = PhaseStatus;

  setSelectedTeam(team: ITeam) {
    this.displayObject = 'team';
    this.selectedDisplayTeam = team;
    this.teamService.findTeamPeople(team.id).subscribe(res => {
      this.teamPeople = res.body!;
    });
  }

  addMember(content: any) {
    this.personService.queryPeopleUserByCompany(this.project!.company!.id).subscribe(res => {
      this.companyPeople = res.body!;
      this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
        result => {
          if (result === 'save') {
            // Handle form submission
            if (this.addFormMember.valid) {
              // Form is valid, do something with the form data
              const personId = parseInt(this.addFormMember.get('member')!.value!);
              this.personService
                .addPersonTeam(personId, this.selectedDisplayTeam?.id!)
                .pipe(switchMap(() => this.teamService.findTeamPeople(this.selectedDisplayTeam!.id)))
                .subscribe(res => {
                  this.teamPeople = res.body!;
                });
            }
          }
        },
        reason => {
          // Modal dismissed
        }
      );
    });
  }

  selectChangeHandlerMember($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedMember = target?.value;
  }

  setSelectedSprint(sprint: ISprint) {
    this.selectedDisplaySprint = sprint;
    this.displayObject = 'sprint';
    this.sprintService.getSprintTasks(this.selectedDisplaySprint.id).subscribe(res => {
      this.sprintTasks = res.body!;
      this.displayTasks = this.sprintTasks;
      this.toDoTasks = this.sprintTasks.filter(task => task.status === 'TODO');
      this.inprogressTasks = this.sprintTasks.filter(task => task.status === 'IN_PROGRESS');
      this.doneTasks = this.sprintTasks.filter(task => task.status === 'DONE');
      this.readyForQaTasks = this.sprintTasks.filter(task => task.status === 'READY_FOR_QA');
      this.codeReviewTasks = this.sprintTasks.filter(task => task.status === 'CODE_REVIEW');
    });
  }

  addTask(content: any) {
    this.projectService.getProjectPeopleUser(this.project!.id).subscribe(res => {
      this.projectPeople = res.body!;
      this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
        result => {
          if (result === 'save') {
            // Handle form submission
            if (this.createFormTask.valid) {
              // Form is valid, do something with the form data
              const personId = parseInt(this.createFormTask.get('assignee')!.value!);
              this.taskService
                .createTask(this.createFormTask.getRawValue() as NewTask, this.project!.id, this.selectedDisplaySprint!.id, personId)
                .pipe(switchMap(() => this.sprintService.getSprintTasks(this.selectedDisplaySprint!.id)))
                .subscribe(res => {
                  this.sprintTasks = res.body!;
                  this.displayTasks = this.sprintTasks;
                  this.toDoTasks = this.sprintTasks.filter(task => task.status === 'TODO');
                  this.inprogressTasks = this.sprintTasks.filter(task => task.status === 'IN_PROGRESS');
                  this.doneTasks = this.sprintTasks.filter(task => task.status === 'DONE');
                  this.readyForQaTasks = this.sprintTasks.filter(task => task.status === 'READY_FOR_QA');
                  this.codeReviewTasks = this.sprintTasks.filter(task => task.status === 'CODE_REVIEW');
                });
            }
          }
        },
        reason => {
          // Modal dismissed
        }
      );
    });
  }

  backToCurrentPhase() {
    this.displayObject = 'phase';
  }

  selectChangeHandlerPersonTask($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedPersonForTask = target?.value;
  }

  selectChangeHandlerTaskDislayStatus($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedTaskDislayStatus = target.value;
    if (this.selectedTaskDislayStatus === 'ALL' && this.selectedTaskDisplayPriority === 'ALL') {
      this.displayTasks = this.sprintTasks;
    } else if (this.selectedTaskDislayStatus === 'ALL' && this.selectedTaskDisplayPriority !== 'ALL') {
      this.displayTasks = this.sprintTasks.filter(task => {
        return task.priority === this.selectedTaskDisplayPriority;
      });
    } else if (this.selectedTaskDislayStatus !== 'ALL' && this.selectedTaskDisplayPriority === 'ALL') {
      this.displayTasks = this.sprintTasks.filter(task => {
        return task.status === this.selectedTaskDislayStatus;
      });
    } else {
      this.displayTasks = this.sprintTasks.filter(task => {
        return task.status === this.selectedTaskDislayStatus && task.priority === this.selectedTaskDisplayPriority;
      });
    }
  }

  selectChangeHandlerTaskDisplayPriority($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedTaskDisplayPriority = target.value;
    if (this.selectedTaskDislayStatus === 'ALL' && this.selectedTaskDisplayPriority === 'ALL') {
      this.displayTasks = this.sprintTasks;
    } else if (this.selectedTaskDislayStatus === 'ALL' && this.selectedTaskDisplayPriority !== 'ALL') {
      this.displayTasks = this.sprintTasks.filter(task => {
        return task.priority === this.selectedTaskDisplayPriority;
      });
    } else if (this.selectedTaskDislayStatus !== 'ALL' && this.selectedTaskDisplayPriority === 'ALL') {
      this.displayTasks = this.sprintTasks.filter(task => {
        return task.status === this.selectedTaskDislayStatus;
      });
    } else {
      this.displayTasks = this.sprintTasks.filter(task => {
        return task.status === this.selectedTaskDislayStatus && task.priority === this.selectedTaskDisplayPriority;
      });
    }
  }

  editTask(task: ITask, content: any) {
    this.projectService.getProjectPeopleUser(this.project!.id).subscribe(res => {
      this.projectPeople = res.body!;
      this.editFormTask.setValue({
        title: task.title || '',
        description: task.description || '',
        estimatedTime: task.estimatedTime!.toString() || '',
        timeLogged: task.timeLogged ? task.timeLogged.toString() : '0',
        storyPoints: task.storyPoints ? task.storyPoints.toString() : '0',
        priority: task.priority || '',
        status: task.status || '',
        assignee: task.assignee || '',
        reporter: task.reporter || '',
      });
      this.selectedEditTaskStatus = task.status!.toString();
      this.selectedEditMember = task.assignee!.toString();
      this.selectedEditTaskPriority = task.priority!.toString();

      this.modalService.open(content, { ariaLabelledBy: 'modal-title', backdrop: 'static' }).result.then(
        result => {
          if (result === 'save') {
            // Handle form submission
            if (this.editFormTask.valid) {
              // Form is valid, do something with the form data
              const personId = parseInt(this.editFormTask.get('assignee')!.value!);
              this.taskService.editTask(this.editFormTask.getRawValue() as EditTask, task.id, personId).subscribe(res => {
                this.sprintService.getSprintTasks(this.selectedDisplaySprint!.id).subscribe(res => {
                  this.sprintTasks = res.body!;
                  this.displayTasks = this.sprintTasks;
                });
              });
            }
          }
        },
        reason => {
          // Modal dismissed
        }
      );
    });
  }

  selectChangeHandlerEditTaskStatus($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedEditTaskStatus = target.value;
  }

  selectChangeHandlerEditProbability($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedEditTaskPriority = target.value;
  }

  selectChangeHandlerEditPersonTask($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedEditTaskAssignee = target.value;
  }

  selectChangeHandlerSprintStatus($event: Event) {
    this.selectedSprintStatus = ($event.target as HTMLSelectElement).value;
  }
}
