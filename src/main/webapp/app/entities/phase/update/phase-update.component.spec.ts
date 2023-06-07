import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PhaseFormService } from './phase-form.service';
import { PhaseService } from '../service/phase.service';
import { IPhase } from '../phase.model';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { PhaseUpdateComponent } from './phase-update.component';

describe('Phase Management Update Component', () => {
  let comp: PhaseUpdateComponent;
  let fixture: ComponentFixture<PhaseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let phaseFormService: PhaseFormService;
  let phaseService: PhaseService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PhaseUpdateComponent],
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
      .overrideTemplate(PhaseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PhaseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    phaseFormService = TestBed.inject(PhaseFormService);
    phaseService = TestBed.inject(PhaseService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const phase: IPhase = { id: 456 };
      const project: IProject = { id: 34375 };
      phase.project = project;

      const projectCollection: IProject[] = [{ id: 75522 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ phase });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining)
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const phase: IPhase = { id: 456 };
      const project: IProject = { id: 24005 };
      phase.project = project;

      activatedRoute.data = of({ phase });
      comp.ngOnInit();

      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.phase).toEqual(phase);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhase>>();
      const phase = { id: 123 };
      jest.spyOn(phaseFormService, 'getPhase').mockReturnValue(phase);
      jest.spyOn(phaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phase }));
      saveSubject.complete();

      // THEN
      expect(phaseFormService.getPhase).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(phaseService.update).toHaveBeenCalledWith(expect.objectContaining(phase));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhase>>();
      const phase = { id: 123 };
      jest.spyOn(phaseFormService, 'getPhase').mockReturnValue({ id: null });
      jest.spyOn(phaseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phase: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: phase }));
      saveSubject.complete();

      // THEN
      expect(phaseFormService.getPhase).toHaveBeenCalled();
      expect(phaseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPhase>>();
      const phase = { id: 123 };
      jest.spyOn(phaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ phase });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(phaseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        comp.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
