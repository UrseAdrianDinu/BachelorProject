import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: 32440,
  name: 'Djibouti Washington',
  crn: 'Awesome Avon Avon',
};

export const sampleWithPartialData: ICompany = {
  id: 55354,
  name: 'turquoise',
  crn: 'contextually-based Ball',
  streetAdress: 'contingency',
  country: 'Oman',
};

export const sampleWithFullData: ICompany = {
  id: 45247,
  name: 'Nebraska',
  crn: '1080p transition',
  description: 'withdrawal Tala payment',
  email: 'Geoffrey.Lakin42@yahoo.com',
  streetAdress: 'Research aggregate neural',
  city: 'Macejkovichaven',
  country: 'Solomon Islands',
  ceoName: 'bus innovative',
};

export const sampleWithNewData: NewCompany = {
  name: 'Response multi-byte',
  crn: 'parse',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
