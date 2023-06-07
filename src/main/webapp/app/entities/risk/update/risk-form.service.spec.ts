import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../risk.test-samples';

import { RiskFormService } from './risk-form.service';

describe('Risk Form Service', () => {
  let service: RiskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskFormService);
  });

  describe('Service methods', () => {
    describe('createRiskFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRiskFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            probability: expect.any(Object),
            impact: expect.any(Object),
            phase: expect.any(Object),
          })
        );
      });

      it('passing IRisk should create a new form with FormGroup', () => {
        const formGroup = service.createRiskFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            description: expect.any(Object),
            probability: expect.any(Object),
            impact: expect.any(Object),
            phase: expect.any(Object),
          })
        );
      });
    });

    describe('getRisk', () => {
      it('should return NewRisk for default Risk initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createRiskFormGroup(sampleWithNewData);

        const risk = service.getRisk(formGroup) as any;

        expect(risk).toMatchObject(sampleWithNewData);
      });

      it('should return NewRisk for empty Risk initial value', () => {
        const formGroup = service.createRiskFormGroup();

        const risk = service.getRisk(formGroup) as any;

        expect(risk).toMatchObject({});
      });

      it('should return IRisk', () => {
        const formGroup = service.createRiskFormGroup(sampleWithRequiredData);

        const risk = service.getRisk(formGroup) as any;

        expect(risk).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRisk should not enable id FormControl', () => {
        const formGroup = service.createRiskFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRisk should disable id FormControl', () => {
        const formGroup = service.createRiskFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
