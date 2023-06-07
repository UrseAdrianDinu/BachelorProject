import { IPerson } from '../person.model';
import { IUser } from '../../../admin/user-management/user-management.model';

export interface IPersonUser {
  personDTO: IPerson;
  adminUserDTO: IUser;
}
