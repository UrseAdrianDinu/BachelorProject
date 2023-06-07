import dayjs from 'dayjs/esm';
import { ITeam } from 'app/entities/team/team.model';
import { ICompany } from 'app/entities/company/company.model';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';

export interface IProject {
  id: number;
  name?: string | null;
  code?: string | null;
  domain?: string | null;
  description?: string | null;
  status?: ProjectStatus | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  billable?: boolean | null;
  teams?: Pick<ITeam, 'id'>[] | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
