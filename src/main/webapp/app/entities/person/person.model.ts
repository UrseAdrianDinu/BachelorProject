import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ITeam } from 'app/entities/team/team.model';
import { IDepartment } from 'app/entities/department/department.model';
import { IRole } from 'app/entities/role/role.model';
import { PersonStatus } from 'app/entities/enumerations/person-status.model';

export interface IPerson {
  id: number;
  code?: string | null;
  phoneNumber?: string | null;
  salary?: number | null;
  status?: PersonStatus | null;
  hireDate?: dayjs.Dayjs | null;
  dateOfBirth?: dayjs.Dayjs | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  user?: Pick<IUser, 'id'> | null;
  manager?: Pick<IPerson, 'id'> | null;
  teams?: Pick<ITeam, 'id'>[] | null;
  department?: Pick<IDepartment, 'id'> | null;
  role?: Pick<IRole, 'id'> | null;
}

export type NewPerson = Omit<IPerson, 'id'> & { id: null };
