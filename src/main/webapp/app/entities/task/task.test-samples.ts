import dayjs from 'dayjs/esm';

import { TaskStatus } from 'app/entities/enumerations/task-status.model';
import { TaskPriority } from 'app/entities/enumerations/task-priority.model';

import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 37978,
  title: 'CSS Account Up-sized',
};

export const sampleWithPartialData: ITask = {
  id: 31278,
  title: 'Jewelery functionalities Virginia',
  startDate: dayjs('2023-04-02'),
  estimatedTime: 66924,
  timeLogged: 79992,
  storyPoints: 32084,
  priority: TaskPriority['LOWEST'],
  reporter: 'Industrial Dirham alarm',
};

export const sampleWithFullData: ITask = {
  id: 34797,
  title: 'pink',
  description: 'Table',
  status: TaskStatus['READY_FOR_QA'],
  startDate: dayjs('2023-04-03'),
  estimatedTime: 61204,
  timeLogged: 67755,
  storyPoints: 99122,
  priority: TaskPriority['LOW'],
  assignee: 'Designer Licensed Account',
  reporter: 'Sleek',
};

export const sampleWithNewData: NewTask = {
  title: 'disintermediate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
