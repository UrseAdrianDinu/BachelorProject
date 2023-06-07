import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRisk, NewRisk } from '../risk.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRisk for edit and NewRiskFormGroupInput for create.
 */
type RiskFormGroupInput = IRisk | PartialWithRequiredKeyOf<NewRisk>;

type RiskFormDefaults = Pick<NewRisk, 'id'>;

type RiskFormGroupContent = {
  id: FormControl<IRisk['id'] | NewRisk['id']>;
  description: FormControl<IRisk['description']>;
  probability: FormControl<IRisk['probability']>;
  impact: FormControl<IRisk['impact']>;
  phase: FormControl<IRisk['phase']>;
};

export type RiskFormGroup = FormGroup<RiskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RiskFormService {
  createRiskFormGroup(risk: RiskFormGroupInput = { id: null }): RiskFormGroup {
    const riskRawValue = {
      ...this.getFormDefaults(),
      ...risk,
    };
    return new FormGroup<RiskFormGroupContent>({
      id: new FormControl(
        { value: riskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(riskRawValue.description),
      probability: new FormControl(riskRawValue.probability),
      impact: new FormControl(riskRawValue.impact),
      phase: new FormControl(riskRawValue.phase),
    });
  }

  getRisk(form: RiskFormGroup): IRisk | NewRisk {
    return form.getRawValue() as IRisk | NewRisk;
  }

  resetForm(form: RiskFormGroup, risk: RiskFormGroupInput): void {
    const riskRawValue = { ...this.getFormDefaults(), ...risk };
    form.reset(
      {
        ...riskRawValue,
        id: { value: riskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RiskFormDefaults {
    return {
      id: null,
    };
  }
}
