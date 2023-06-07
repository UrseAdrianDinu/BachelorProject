import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TaskFormService, TaskFormGroup } from './task-form.service';
import { ITask } from '../task.model';
import { TaskService } from '../service/task.service';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { SprintService } from 'app/entities/sprint/service/sprint.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { TaskStatus } from 'app/entities/enumerations/task-status.model';
import { TaskPriority } from 'app/entities/enumerations/task-priority.model';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;
  task: ITask | null = null;
  taskStatusValues = Object.keys(TaskStatus);
  taskPriorityValues = Object.keys(TaskPriority);

  peopleSharedCollection: IPerson[] = [];
  projectsSharedCollection: IProject[] = [];
  sprintsSharedCollection: ISprint[] = [];
  teamsSharedCollection: ITeam[] = [];

  editForm: TaskFormGroup = this.taskFormService.createTaskFormGroup();

  constructor(
    protected taskService: TaskService,
    protected taskFormService: TaskFormService,
    protected personService: PersonService,
    protected projectService: ProjectService,
    protected sprintService: SprintService,
    protected teamService: TeamService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePerson = (o1: IPerson | null, o2: IPerson | null): boolean => this.personService.comparePerson(o1, o2);

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  compareSprint = (o1: ISprint | null, o2: ISprint | null): boolean => this.sprintService.compareSprint(o1, o2);

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.task = task;
      if (task) {
        this.updateForm(task);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.taskFormService.getTask(this.editForm);
    if (task.id !== null) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(task: ITask): void {
    this.task = task;
    this.taskFormService.resetForm(this.editForm, task);

    this.peopleSharedCollection = this.personService.addPersonToCollectionIfMissing<IPerson>(this.peopleSharedCollection, task.person);
    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      task.project
    );
    this.sprintsSharedCollection = this.sprintService.addSprintToCollectionIfMissing<ISprint>(this.sprintsSharedCollection, task.sprint);
    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, task.team);
  }

  protected loadRelationshipsOptions(): void {
    this.personService
      .query()
      .pipe(map((res: HttpResponse<IPerson[]>) => res.body ?? []))
      .pipe(map((people: IPerson[]) => this.personService.addPersonToCollectionIfMissing<IPerson>(people, this.task?.person)))
      .subscribe((people: IPerson[]) => (this.peopleSharedCollection = people));

    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.task?.project)))
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));

    this.sprintService
      .query()
      .pipe(map((res: HttpResponse<ISprint[]>) => res.body ?? []))
      .pipe(map((sprints: ISprint[]) => this.sprintService.addSprintToCollectionIfMissing<ISprint>(sprints, this.task?.sprint)))
      .subscribe((sprints: ISprint[]) => (this.sprintsSharedCollection = sprints));

    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, this.task?.team)))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));
  }
}
