import dayjs from 'dayjs/esm';

import { SprintStatus } from 'app/entities/enumerations/sprint-status.model';

import { ISprint, NewSprint } from './sprint.model';

export const sampleWithRequiredData: ISprint = {
  id: 87675,
};

export const sampleWithPartialData: ISprint = {
  id: 6350,
  number: 14352,
  status: SprintStatus['CLOSED'],
  goal: 'calculate',
  startDate: dayjs('2023-04-03'),
};

export const sampleWithFullData: ISprint = {
  id: 29762,
  number: 67019,
  status: SprintStatus['CLOSED'],
  goal: 'Small Designer Mexico',
  startDate: dayjs('2023-04-03'),
  endDate: dayjs('2023-04-03'),
};

export const sampleWithNewData: NewSprint = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
