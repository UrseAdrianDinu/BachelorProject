import dayjs from 'dayjs/esm';
import { IPhase } from 'app/entities/phase/phase.model';
import { SprintStatus } from 'app/entities/enumerations/sprint-status.model';

export interface ISprint {
  id: number;
  number?: number | null;
  status?: SprintStatus | null;
  goal?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  phase?: Pick<IPhase, 'id'> | null;
}

export type NewSprint = Omit<ISprint, 'id'> & { id: null };
