import dayjs from 'dayjs/esm';
import { IProject } from 'app/entities/project/project.model';
import { SprintStatus } from '../enumerations/sprint-status.model';
import { PhaseStatus } from '../enumerations/phase-status.model';

export interface IPhase {
  id: number;
  name?: string | null;
  objective?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  estimatedTime?: number | null;
  status?: PhaseStatus | null;
  project?: Pick<IProject, 'id'> | null;
}

export type NewPhase = Omit<IPhase, 'id'> & { id: null };
