import dayjs from 'dayjs/esm';

import { PersonStatus } from 'app/entities/enumerations/person-status.model';

import { IPerson, NewPerson } from './person.model';

export const sampleWithRequiredData: IPerson = {
  id: 31094,
};

export const sampleWithPartialData: IPerson = {
  id: 9169,
  code: 'Cotton payment',
  phoneNumber: 'concept',
  status: PersonStatus['ACTIVE'],
  dateOfBirth: dayjs('2023-04-03'),
  streetAddress: 'blockchains',
};

export const sampleWithFullData: IPerson = {
  id: 92682,
  code: 'Sleek Kwacha deposit',
  phoneNumber: 'Universal',
  salary: 17657,
  status: PersonStatus['ACTIVE'],
  hireDate: dayjs('2023-04-03'),
  dateOfBirth: dayjs('2023-04-03'),
  streetAddress: 'program District',
  postalCode: 'Tuna Personal',
  city: 'Pollichborough',
  region: 'District Outdoors eyeballs',
  country: 'Yemen',
};

export const sampleWithNewData: NewPerson = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
