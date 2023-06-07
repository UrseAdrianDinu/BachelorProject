import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../phase.test-samples';

import { PhaseFormService } from './phase-form.service';

describe('Phase Form Service', () => {
  let service: PhaseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhaseFormService);
  });

  describe('Service methods', () => {
    describe('createPhaseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPhaseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            objective: expect.any(Object),
            description: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            estimatedTime: expect.any(Object),
            project: expect.any(Object),
          })
        );
      });

      it('passing IPhase should create a new form with FormGroup', () => {
        const formGroup = service.createPhaseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            objective: expect.any(Object),
            description: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            estimatedTime: expect.any(Object),
            project: expect.any(Object),
          })
        );
      });
    });

    describe('getPhase', () => {
      it('should return NewPhase for default Phase initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPhaseFormGroup(sampleWithNewData);

        const phase = service.getPhase(formGroup) as any;

        expect(phase).toMatchObject(sampleWithNewData);
      });

      it('should return NewPhase for empty Phase initial value', () => {
        const formGroup = service.createPhaseFormGroup();

        const phase = service.getPhase(formGroup) as any;

        expect(phase).toMatchObject({});
      });

      it('should return IPhase', () => {
        const formGroup = service.createPhaseFormGroup(sampleWithRequiredData);

        const phase = service.getPhase(formGroup) as any;

        expect(phase).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPhase should not enable id FormControl', () => {
        const formGroup = service.createPhaseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPhase should disable id FormControl', () => {
        const formGroup = service.createPhaseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
