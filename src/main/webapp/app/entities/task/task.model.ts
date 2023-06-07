import dayjs from 'dayjs/esm';
import { IPerson } from 'app/entities/person/person.model';
import { IProject } from 'app/entities/project/project.model';
import { ISprint } from 'app/entities/sprint/sprint.model';
import { ITeam } from 'app/entities/team/team.model';
import { TaskStatus } from 'app/entities/enumerations/task-status.model';
import { TaskPriority } from 'app/entities/enumerations/task-priority.model';

export interface ITask {
  id: number;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  startDate?: dayjs.Dayjs | null;
  estimatedTime?: number | null;
  timeLogged?: number | null;
  storyPoints?: number | null;
  priority?: TaskPriority | null;
  assignee?: string | null;
  reporter?: string | null;
  person?: Pick<IPerson, 'id'> | null;
  project?: Pick<IProject, 'id'> | null;
  sprint?: Pick<ISprint, 'id'> | null;
  team?: Pick<ITeam, 'id'> | null;
}

export type NewTask = Omit<ITask, 'id'> & { id: null };
