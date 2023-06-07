import dayjs from 'dayjs/esm';

import { IPhase, NewPhase } from './phase.model';

export const sampleWithRequiredData: IPhase = {
  id: 87150,
};

export const sampleWithPartialData: IPhase = {
  id: 34574,
  name: 'Bosnia maximize programming',
  objective: 'Global tolerance withdrawal',
};

export const sampleWithFullData: IPhase = {
  id: 9828,
  name: 'white',
  objective: 'Berkshire Licensed',
  description: 'Proactive Operations initiatives',
  startDate: dayjs('2023-04-03'),
  endDate: dayjs('2023-04-03'),
  estimatedTime: 25146,
};

export const sampleWithNewData: NewPhase = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
