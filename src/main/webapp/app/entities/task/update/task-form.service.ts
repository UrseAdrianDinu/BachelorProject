import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITask, NewTask } from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITask for edit and NewTaskFormGroupInput for create.
 */
type TaskFormGroupInput = ITask | PartialWithRequiredKeyOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'id'>;

type TaskFormGroupContent = {
  id: FormControl<ITask['id'] | NewTask['id']>;
  title: FormControl<ITask['title']>;
  description: FormControl<ITask['description']>;
  status: FormControl<ITask['status']>;
  startDate: FormControl<ITask['startDate']>;
  estimatedTime: FormControl<ITask['estimatedTime']>;
  timeLogged: FormControl<ITask['timeLogged']>;
  storyPoints: FormControl<ITask['storyPoints']>;
  priority: FormControl<ITask['priority']>;
  assignee: FormControl<ITask['assignee']>;
  reporter: FormControl<ITask['reporter']>;
  person: FormControl<ITask['person']>;
  project: FormControl<ITask['project']>;
  sprint: FormControl<ITask['sprint']>;
  team: FormControl<ITask['team']>;
};

export type TaskFormGroup = FormGroup<TaskFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskFormService {
  createTaskFormGroup(task: TaskFormGroupInput = { id: null }): TaskFormGroup {
    const taskRawValue = {
      ...this.getFormDefaults(),
      ...task,
    };
    return new FormGroup<TaskFormGroupContent>({
      id: new FormControl(
        { value: taskRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(taskRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(taskRawValue.description),
      status: new FormControl(taskRawValue.status),
      startDate: new FormControl(taskRawValue.startDate),
      estimatedTime: new FormControl(taskRawValue.estimatedTime),
      timeLogged: new FormControl(taskRawValue.timeLogged),
      storyPoints: new FormControl(taskRawValue.storyPoints),
      priority: new FormControl(taskRawValue.priority),
      assignee: new FormControl(taskRawValue.assignee),
      reporter: new FormControl(taskRawValue.reporter),
      person: new FormControl(taskRawValue.person),
      project: new FormControl(taskRawValue.project),
      sprint: new FormControl(taskRawValue.sprint),
      team: new FormControl(taskRawValue.team),
    });
  }

  getTask(form: TaskFormGroup): ITask | NewTask {
    return form.getRawValue() as ITask | NewTask;
  }

  resetForm(form: TaskFormGroup, task: TaskFormGroupInput): void {
    const taskRawValue = { ...this.getFormDefaults(), ...task };
    form.reset(
      {
        ...taskRawValue,
        id: { value: taskRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TaskFormDefaults {
    return {
      id: null,
    };
  }
}
