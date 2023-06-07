import { IPerson } from '../person.model';
import { IUser } from '../../../admin/user-management/user-management.model';
import { IRole } from '../../role/role.model';

export interface IPersonUserRole {
  personDTO: IPerson;
  adminUserDTO: IUser;
  roleDTO: IRole;
}
