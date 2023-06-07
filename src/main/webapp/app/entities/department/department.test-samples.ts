import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 39095,
  name: 'neutral markets',
  code: 'bypass',
};

export const sampleWithPartialData: IDepartment = {
  id: 16638,
  name: 'Table blue',
  code: 'white compressing',
};

export const sampleWithFullData: IDepartment = {
  id: 33771,
  name: 'engineer Hat best-of-breed',
  code: 'Metal',
  email: 'Jackeline79@hotmail.com',
  description: 'grid-enabled',
};

export const sampleWithNewData: NewDepartment = {
  name: 'Factors',
  code: 'contextually-based Computer synthesize',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
