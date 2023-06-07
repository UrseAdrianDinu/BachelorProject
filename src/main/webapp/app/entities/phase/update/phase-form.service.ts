import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPhase, NewPhase } from '../phase.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPhase for edit and NewPhaseFormGroupInput for create.
 */
type PhaseFormGroupInput = IPhase | PartialWithRequiredKeyOf<NewPhase>;

type PhaseFormDefaults = Pick<NewPhase, 'id'>;

type PhaseFormGroupContent = {
  id: FormControl<IPhase['id'] | NewPhase['id']>;
  name: FormControl<IPhase['name']>;
  objective: FormControl<IPhase['objective']>;
  description: FormControl<IPhase['description']>;
  startDate: FormControl<IPhase['startDate']>;
  endDate: FormControl<IPhase['endDate']>;
  estimatedTime: FormControl<IPhase['estimatedTime']>;
  project: FormControl<IPhase['project']>;
};

export type PhaseFormGroup = FormGroup<PhaseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PhaseFormService {
  createPhaseFormGroup(phase: PhaseFormGroupInput = { id: null }): PhaseFormGroup {
    const phaseRawValue = {
      ...this.getFormDefaults(),
      ...phase,
    };
    return new FormGroup<PhaseFormGroupContent>({
      id: new FormControl(
        { value: phaseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(phaseRawValue.name),
      objective: new FormControl(phaseRawValue.objective),
      description: new FormControl(phaseRawValue.description),
      startDate: new FormControl(phaseRawValue.startDate),
      endDate: new FormControl(phaseRawValue.endDate),
      estimatedTime: new FormControl(phaseRawValue.estimatedTime),
      project: new FormControl(phaseRawValue.project),
    });
  }

  getPhase(form: PhaseFormGroup): IPhase | NewPhase {
    return form.getRawValue() as IPhase | NewPhase;
  }

  resetForm(form: PhaseFormGroup, phase: PhaseFormGroupInput): void {
    const phaseRawValue = { ...this.getFormDefaults(), ...phase };
    form.reset(
      {
        ...phaseRawValue,
        id: { value: phaseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PhaseFormDefaults {
    return {
      id: null,
    };
  }
}
