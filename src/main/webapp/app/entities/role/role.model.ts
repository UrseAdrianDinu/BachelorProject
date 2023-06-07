import { RoleSeniority } from 'app/entities/enumerations/role-seniority.model';

export interface IRole {
  id: number;
  name?: string | null;
  code?: string | null;
  seniority?: RoleSeniority | null;
}

export type NewRole = Omit<IRole, 'id'> & { id: null };
