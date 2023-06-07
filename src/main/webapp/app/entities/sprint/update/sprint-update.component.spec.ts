import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SprintFormService } from './sprint-form.service';
import { SprintService } from '../service/sprint.service';
import { ISprint } from '../sprint.model';
import { IPhase } from 'app/entities/phase/phase.model';
import { PhaseService } from 'app/entities/phase/service/phase.service';

import { SprintUpdateComponent } from './sprint-update.component';

describe('Sprint Management Update Component', () => {
  let comp: SprintUpdateComponent;
  let fixture: ComponentFixture<SprintUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sprintFormService: SprintFormService;
  let sprintService: SprintService;
  let phaseService: PhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SprintUpdateComponent],
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
      .overrideTemplate(SprintUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SprintUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sprintFormService = TestBed.inject(SprintFormService);
    sprintService = TestBed.inject(SprintService);
    phaseService = TestBed.inject(PhaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Phase query and add missing value', () => {
      const sprint: ISprint = { id: 456 };
      const phase: IPhase = { id: 54217 };
      sprint.phase = phase;

      const phaseCollection: IPhase[] = [{ id: 97649 }];
      jest.spyOn(phaseService, 'query').mockReturnValue(of(new HttpResponse({ body: phaseCollection })));
      const additionalPhases = [phase];
      const expectedCollection: IPhase[] = [...additionalPhases, ...phaseCollection];
      jest.spyOn(phaseService, 'addPhaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sprint });
      comp.ngOnInit();

      expect(phaseService.query).toHaveBeenCalled();
      expect(phaseService.addPhaseToCollectionIfMissing).toHaveBeenCalledWith(
        phaseCollection,
        ...additionalPhases.map(expect.objectContaining)
      );
      expect(comp.phasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sprint: ISprint = { id: 456 };
      const phase: IPhase = { id: 53134 };
      sprint.phase = phase;

      activatedRoute.data = of({ sprint });
      comp.ngOnInit();

      expect(comp.phasesSharedCollection).toContain(phase);
      expect(comp.sprint).toEqual(sprint);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISprint>>();
      const sprint = { id: 123 };
      jest.spyOn(sprintFormService, 'getSprint').mockReturnValue(sprint);
      jest.spyOn(sprintService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sprint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sprint }));
      saveSubject.complete();

      // THEN
      expect(sprintFormService.getSprint).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sprintService.update).toHaveBeenCalledWith(expect.objectContaining(sprint));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISprint>>();
      const sprint = { id: 123 };
      jest.spyOn(sprintFormService, 'getSprint').mockReturnValue({ id: null });
      jest.spyOn(sprintService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sprint: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sprint }));
      saveSubject.complete();

      // THEN
      expect(sprintFormService.getSprint).toHaveBeenCalled();
      expect(sprintService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISprint>>();
      const sprint = { id: 123 };
      jest.spyOn(sprintService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sprint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sprintService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePhase', () => {
      it('Should forward to phaseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(phaseService, 'comparePhase');
        comp.comparePhase(entity, entity2);
        expect(phaseService.comparePhase).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
