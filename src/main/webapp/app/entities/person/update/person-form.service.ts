import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPerson, NewPerson } from '../person.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPerson for edit and NewPersonFormGroupInput for create.
 */
type PersonFormGroupInput = IPerson | PartialWithRequiredKeyOf<NewPerson>;

type PersonFormDefaults = Pick<NewPerson, 'id' | 'teams'>;

type PersonFormGroupContent = {
  id: FormControl<IPerson['id'] | NewPerson['id']>;
  code: FormControl<IPerson['code']>;
  phoneNumber: FormControl<IPerson['phoneNumber']>;
  salary: FormControl<IPerson['salary']>;
  status: FormControl<IPerson['status']>;
  hireDate: FormControl<IPerson['hireDate']>;
  dateOfBirth: FormControl<IPerson['dateOfBirth']>;
  streetAddress: FormControl<IPerson['streetAddress']>;
  postalCode: FormControl<IPerson['postalCode']>;
  city: FormControl<IPerson['city']>;
  region: FormControl<IPerson['region']>;
  country: FormControl<IPerson['country']>;
  user: FormControl<IPerson['user']>;
  manager: FormControl<IPerson['manager']>;
  teams: FormControl<IPerson['teams']>;
  department: FormControl<IPerson['department']>;
  role: FormControl<IPerson['role']>;
};

export type PersonFormGroup = FormGroup<PersonFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonFormService {
  createPersonFormGroup(person: PersonFormGroupInput = { id: null }): PersonFormGroup {
    const personRawValue = {
      ...this.getFormDefaults(),
      ...person,
    };
    return new FormGroup<PersonFormGroupContent>({
      id: new FormControl(
        { value: personRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      code: new FormControl(personRawValue.code),
      phoneNumber: new FormControl(personRawValue.phoneNumber),
      salary: new FormControl(personRawValue.salary),
      status: new FormControl(personRawValue.status),
      hireDate: new FormControl(personRawValue.hireDate),
      dateOfBirth: new FormControl(personRawValue.dateOfBirth),
      streetAddress: new FormControl(personRawValue.streetAddress),
      postalCode: new FormControl(personRawValue.postalCode),
      city: new FormControl(personRawValue.city),
      region: new FormControl(personRawValue.region),
      country: new FormControl(personRawValue.country),
      user: new FormControl(personRawValue.user),
      manager: new FormControl(personRawValue.manager),
      teams: new FormControl(personRawValue.teams ?? []),
      department: new FormControl(personRawValue.department),
      role: new FormControl(personRawValue.role),
    });
  }

  getPerson(form: PersonFormGroup): IPerson | NewPerson {
    return form.getRawValue() as IPerson | NewPerson;
  }

  resetForm(form: PersonFormGroup, person: PersonFormGroupInput): void {
    const personRawValue = { ...this.getFormDefaults(), ...person };
    form.reset(
      {
        ...personRawValue,
        id: { value: personRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PersonFormDefaults {
    return {
      id: null,
      teams: [],
    };
  }
}
