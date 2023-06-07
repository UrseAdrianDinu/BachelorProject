import { IPerson } from 'app/entities/person/person.model';
import { IProject } from 'app/entities/project/project.model';

export interface ITeam {
  id: number;
  name?: string | null;
  email?: string | null;
  people?: Pick<IPerson, 'id'>[] | null;
  projects?: Pick<IProject, 'id'>[] | null;
}

export type NewTeam = Omit<ITeam, 'id'> & { id: null };
