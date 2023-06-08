import { TaskStatus } from '../../enumerations/task-status.model';
import { TaskPriority } from '../../enumerations/task-priority.model';
import { IPerson } from '../../person/person.model';
import { IProject } from '../../project/project.model';
import { ISprint } from '../../sprint/sprint.model';
import { ITeam } from '../../team/team.model';

export interface EditTask {
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  estimatedTime?: number | null;
  timeLogged?: number | null;
  storyPoints?: number | null;
  priority?: TaskPriority | null;
  assignee?: string | null;
  reporter?: string | null;
}
