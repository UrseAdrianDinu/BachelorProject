import dayjs from 'dayjs/esm';

import { ProjectStatus } from 'app/entities/enumerations/project-status.model';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 55962,
  name: 'COM dedicated Agent',
  code: 'Awesome users',
};

export const sampleWithPartialData: IProject = {
  id: 24713,
  name: 'Borders Health',
  code: 'Response Investor Loan',
  domain: 'Tasty secondary',
  description: 'generate Designer',
  status: ProjectStatus['INACTIVE'],
  startDate: dayjs('2023-04-03'),
};

export const sampleWithFullData: IProject = {
  id: 72017,
  name: 'Florida',
  code: 'Timor-Leste backing',
  domain: 'deposit',
  description: 'Assurance state',
  status: ProjectStatus['SIGNING'],
  startDate: dayjs('2023-04-03'),
  endDate: dayjs('2023-04-02'),
  billable: false,
};

export const sampleWithNewData: NewProject = {
  name: 'Berkshire',
  code: 'Cotton',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
