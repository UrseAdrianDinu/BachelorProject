import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RiskFormService } from './risk-form.service';
import { RiskService } from '../service/risk.service';
import { IRisk } from '../risk.model';
import { IPhase } from 'app/entities/phase/phase.model';
import { PhaseService } from 'app/entities/phase/service/phase.service';

import { RiskUpdateComponent } from './risk-update.component';

describe('Risk Management Update Component', () => {
  let comp: RiskUpdateComponent;
  let fixture: ComponentFixture<RiskUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let riskFormService: RiskFormService;
  let riskService: RiskService;
  let phaseService: PhaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RiskUpdateComponent],
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
      .overrideTemplate(RiskUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RiskUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    riskFormService = TestBed.inject(RiskFormService);
    riskService = TestBed.inject(RiskService);
    phaseService = TestBed.inject(PhaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Phase query and add missing value', () => {
      const risk: IRisk = { id: 456 };
      const phase: IPhase = { id: 28448 };
      risk.phase = phase;

      const phaseCollection: IPhase[] = [{ id: 31146 }];
      jest.spyOn(phaseService, 'query').mockReturnValue(of(new HttpResponse({ body: phaseCollection })));
      const additionalPhases = [phase];
      const expectedCollection: IPhase[] = [...additionalPhases, ...phaseCollection];
      jest.spyOn(phaseService, 'addPhaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      expect(phaseService.query).toHaveBeenCalled();
      expect(phaseService.addPhaseToCollectionIfMissing).toHaveBeenCalledWith(
        phaseCollection,
        ...additionalPhases.map(expect.objectContaining)
      );
      expect(comp.phasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const risk: IRisk = { id: 456 };
      const phase: IPhase = { id: 86120 };
      risk.phase = phase;

      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      expect(comp.phasesSharedCollection).toContain(phase);
      expect(comp.risk).toEqual(risk);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRisk>>();
      const risk = { id: 123 };
      jest.spyOn(riskFormService, 'getRisk').mockReturnValue(risk);
      jest.spyOn(riskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: risk }));
      saveSubject.complete();

      // THEN
      expect(riskFormService.getRisk).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(riskService.update).toHaveBeenCalledWith(expect.objectContaining(risk));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRisk>>();
      const risk = { id: 123 };
      jest.spyOn(riskFormService, 'getRisk').mockReturnValue({ id: null });
      jest.spyOn(riskService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ risk: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: risk }));
      saveSubject.complete();

      // THEN
      expect(riskFormService.getRisk).toHaveBeenCalled();
      expect(riskService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRisk>>();
      const risk = { id: 123 };
      jest.spyOn(riskService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ risk });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(riskService.update).toHaveBeenCalled();
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
