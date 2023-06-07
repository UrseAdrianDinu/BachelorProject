import { ICompany } from 'app/entities/company/company.model';

export interface IDepartment {
  id: number;
  name?: string | null;
  code?: string | null;
  email?: string | null;
  description?: string | null;
  parentDept?: Pick<IDepartment, 'id'> | null;
  company?: Pick<ICompany, 'id'> | null;
}

export type NewDepartment = Omit<IDepartment, 'id'> & { id: null };
