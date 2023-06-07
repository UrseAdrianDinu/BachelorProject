import { RoleSeniority } from 'app/entities/enumerations/role-seniority.model';

import { IRole, NewRole } from './role.model';

export const sampleWithRequiredData: IRole = {
  id: 56879,
  name: 'Knolls Loan portals',
  code: 'indexing Specialist Center',
};

export const sampleWithPartialData: IRole = {
  id: 17949,
  name: 'Towels indexing methodical',
  code: 'Chicken',
};

export const sampleWithFullData: IRole = {
  id: 86705,
  name: 'PCI tangible backing',
  code: 'Awesome Bedfordshire bifurcated',
  seniority: RoleSeniority['MID'],
};

export const sampleWithNewData: NewRole = {
  name: 'Sleek',
  code: 'SMTP',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
