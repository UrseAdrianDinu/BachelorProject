import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TaskFormService } from './task-form.service';
import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';
import { IPerson } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/service/person.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { SprintService } from 'app/entities/sprint/service/sprint.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Task Management Update Component', () => {
  let comp: TaskUpdateComponent;
  let fixture: ComponentFixture<TaskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskFormService: TaskFormService;
  let taskService: TaskService;
  let personService: PersonService;
  let projectService: ProjectService;
  let sprintService: SprintService;
  let teamService: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TaskUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TaskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskFormService = TestBed.inject(TaskFormService);
    taskService = TestBed.inject(TaskService);
    personService = TestBed.inject(PersonService);
    projectService = TestBed.inject(ProjectService);
    sprintService = TestBed.inject(SprintService);
    teamService = TestBed.inject(TeamService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Person query and add missing value', () => {
      const task: ITask = { id: 456 };
      const person: IPerson = { id: 61155 };
      task.person = person;

      const personCollection: IPerson[] = [{ id: 14035 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const additionalPeople = [person];
      const expectedCollection: IPerson[] = [...additionalPeople, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(
        personCollection,
        ...additionalPeople.map(expect.objectContaining)
      );
      expect(comp.peopleSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const task: ITask = { id: 456 };
      const project: IProject = { id: 40814 };
      task.project = project;

      const projectCollection: IProject[] = [{ id: 7228 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining)
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Sprint query and add missing value', () => {
      const task: ITask = { id: 456 };
      const sprint: ISprint = { id: 52464 };
      task.sprint = sprint;

      const sprintCollection: ISprint[] = [{ id: 10346 }];
      jest.spyOn(sprintService, 'query').mockReturnValue(of(new HttpResponse({ body: sprintCollection })));
      const additionalSprints = [sprint];
      const expectedCollection: ISprint[] = [...additionalSprints, ...sprintCollection];
      jest.spyOn(sprintService, 'addSprintToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(sprintService.query).toHaveBeenCalled();
      expect(sprintService.addSprintToCollectionIfMissing).toHaveBeenCalledWith(
        sprintCollection,
        ...additionalSprints.map(expect.objectContaining)
      );
      expect(comp.sprintsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Team query and add missing value', () => {
      const task: ITask = { id: 456 };
      const team: ITeam = { id: 9088 };
      task.team = team;

      const teamCollection: ITeam[] = [{ id: 50298 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [team];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining)
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const task: ITask = { id: 456 };
      const person: IPerson = { id: 84074 };
      task.person = person;
      const project: IProject = { id: 3913 };
      task.project = project;
      const sprint: ISprint = { id: 33296 };
      task.sprint = sprint;
      const team: ITeam = { id: 53763 };
      task.team = team;

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.peopleSharedCollection).toContain(person);
      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.sprintsSharedCollection).toContain(sprint);
      expect(comp.teamsSharedCollection).toContain(team);
      expect(comp.task).toEqual(task);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue(task);
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(expect.objectContaining(task));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: task }));
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(taskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITask>>();
      const task = { id: 123 };
      jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePerson', () => {
      it('Should forward to personService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(personService, 'comparePerson');
        comp.comparePerson(entity, entity2);
        expect(personService.comparePerson).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        comp.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSprint', () => {
      it('Should forward to sprintService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sprintService, 'compareSprint');
        comp.compareSprint(entity, entity2);
        expect(sprintService.compareSprint).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTeam', () => {
      it('Should forward to teamService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(teamService, 'compareTeam');
        comp.compareTeam(entity, entity2);
        expect(teamService.compareTeam).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
