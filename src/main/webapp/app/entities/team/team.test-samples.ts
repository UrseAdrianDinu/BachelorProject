import { ITeam, NewTeam } from './team.model';

export const sampleWithRequiredData: ITeam = {
  id: 88024,
};

export const sampleWithPartialData: ITeam = {
  id: 93990,
  email: 'Rhett95@hotmail.com',
};

export const sampleWithFullData: ITeam = {
  id: 63100,
  name: 'Outdoors Metrics cross-platform',
  email: 'Jordane_Jerde@hotmail.com',
};

export const sampleWithNewData: NewTeam = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
