import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PersonFormService } from './person-form.service';
import { PersonService } from '../service/person.service';
import { IPerson } from '../person.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';

import { PersonUpdateComponent } from './person-update.component';

describe('Person Management Update Component', () => {
  let comp: PersonUpdateComponent;
  let fixture: ComponentFixture<PersonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let personFormService: PersonFormService;
  let personService: PersonService;
  let userService: UserService;
  let teamService: TeamService;
  let departmentService: DepartmentService;
  let roleService: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PersonUpdateComponent],
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
      .overrideTemplate(PersonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    personFormService = TestBed.inject(PersonFormService);
    personService = TestBed.inject(PersonService);
    userService = TestBed.inject(UserService);
    teamService = TestBed.inject(TeamService);
    departmentService = TestBed.inject(DepartmentService);
    roleService = TestBed.inject(RoleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const person: IPerson = { id: 456 };
      const user: IUser = { id: 57046 };
      person.user = user;

      const userCollection: IUser[] = [{ id: 27076 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ person });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Person query and add missing value', () => {
      const person: IPerson = { id: 456 };
      const manager: IPerson = { id: 71174 };
      person.manager = manager;

      const personCollection: IPerson[] = [{ id: 53612 }];
      jest.spyOn(personService, 'query').mockReturnValue(of(new HttpResponse({ body: personCollection })));
      const additionalPeople = [manager];
      const expectedCollection: IPerson[] = [...additionalPeople, ...personCollection];
      jest.spyOn(personService, 'addPersonToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ person });
      comp.ngOnInit();

      expect(personService.query).toHaveBeenCalled();
      expect(personService.addPersonToCollectionIfMissing).toHaveBeenCalledWith(
        personCollection,
        ...additionalPeople.map(expect.objectContaining)
      );
      expect(comp.peopleSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Team query and add missing value', () => {
      const person: IPerson = { id: 456 };
      const teams: ITeam[] = [{ id: 22861 }];
      person.teams = teams;

      const teamCollection: ITeam[] = [{ id: 31677 }];
      jest.spyOn(teamService, 'query').mockReturnValue(of(new HttpResponse({ body: teamCollection })));
      const additionalTeams = [...teams];
      const expectedCollection: ITeam[] = [...additionalTeams, ...teamCollection];
      jest.spyOn(teamService, 'addTeamToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ person });
      comp.ngOnInit();

      expect(teamService.query).toHaveBeenCalled();
      expect(teamService.addTeamToCollectionIfMissing).toHaveBeenCalledWith(
        teamCollection,
        ...additionalTeams.map(expect.objectContaining)
      );
      expect(comp.teamsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Department query and add missing value', () => {
      const person: IPerson = { id: 456 };
      const department: IDepartment = { id: 85973 };
      person.department = department;

      const departmentCollection: IDepartment[] = [{ id: 92295 }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ person });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(expect.objectContaining)
      );
      expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Role query and add missing value', () => {
      const person: IPerson = { id: 456 };
      const role: IRole = { id: 24689 };
      person.role = role;

      const roleCollection: IRole[] = [{ id: 41628 }];
      jest.spyOn(roleService, 'query').mockReturnValue(of(new HttpResponse({ body: roleCollection })));
      const additionalRoles = [role];
      const expectedCollection: IRole[] = [...additionalRoles, ...roleCollection];
      jest.spyOn(roleService, 'addRoleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ person });
      comp.ngOnInit();

      expect(roleService.query).toHaveBeenCalled();
      expect(roleService.addRoleToCollectionIfMissing).toHaveBeenCalledWith(
        roleCollection,
        ...additionalRoles.map(expect.objectContaining)
      );
      expect(comp.rolesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const person: IPerson = { id: 456 };
      const user: IUser = { id: 40784 };
      person.user = user;
      const manager: IPerson = { id: 85058 };
      person.manager = manager;
      const team: ITeam = { id: 43537 };
      person.teams = [team];
      const department: IDepartment = { id: 68390 };
      person.department = department;
      const role: IRole = { id: 47259 };
      person.role = role;

      activatedRoute.data = of({ person });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.peopleSharedCollection).toContain(manager);
      expect(comp.teamsSharedCollection).toContain(team);
      expect(comp.departmentsSharedCollection).toContain(department);
      expect(comp.rolesSharedCollection).toContain(role);
      expect(comp.person).toEqual(person);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPerson>>();
      const person = { id: 123 };
      jest.spyOn(personFormService, 'getPerson').mockReturnValue(person);
      jest.spyOn(personService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ person });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: person }));
      saveSubject.complete();

      // THEN
      expect(personFormService.getPerson).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(personService.update).toHaveBeenCalledWith(expect.objectContaining(person));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPerson>>();
      const person = { id: 123 };
      jest.spyOn(personFormService, 'getPerson').mockReturnValue({ id: null });
      jest.spyOn(personService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ person: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: person }));
      saveSubject.complete();

      // THEN
      expect(personFormService.getPerson).toHaveBeenCalled();
      expect(personService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPerson>>();
      const person = { id: 123 };
      jest.spyOn(personService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ person });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(personService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePerson', () => {
      it('Should forward to personService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(personService, 'comparePerson');
        comp.comparePerson(entity, entity2);
        expect(personService.comparePerson).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareDepartment', () => {
      it('Should forward to departmentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareRole', () => {
      it('Should forward to roleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(roleService, 'compareRole');
        comp.compareRole(entity, entity2);
        expect(roleService.compareRole).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
