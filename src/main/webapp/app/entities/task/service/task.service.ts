import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITask, NewTask } from '../task.model';
import { IRisk } from '../../risk/risk.model';
import { EditTask } from './task-edit.model';

export type PartialUpdateTask = Partial<ITask> & Pick<ITask, 'id'>;

type RestOf<T extends ITask | NewTask> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestTask = RestOf<ITask>;

export type NewRestTask = RestOf<NewTask>;

export type PartialUpdateRestTask = RestOf<PartialUpdateTask>;

export type EntityResponseType = HttpResponse<ITask>;
export type EntityArrayResponseType = HttpResponse<ITask[]>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tasks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(task: NewTask): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(task);
    return this.http.post<RestTask>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  createTask(task: NewTask, projectId: number, sprintId: number, personId: number): Observable<EntityResponseType> {
    return this.http.post<IRisk>(`${this.resourceUrl}/project/${projectId}/sprint/${sprintId}/person/${personId}`, task, {
      observe: 'response',
    });
  }

  editTask(task: EditTask, taskId: number, personId: number): Observable<EntityResponseType> {
    return this.http.put<IRisk>(`${this.resourceUrl}/${taskId}/person/${personId}`, task, {
      observe: 'response',
    });
  }

  update(task: ITask): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(task);
    return this.http
      .put<RestTask>(`${this.resourceUrl}/${this.getTaskIdentifier(task)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(task: PartialUpdateTask): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(task);
    return this.http
      .patch<RestTask>(`${this.resourceUrl}/${this.getTaskIdentifier(task)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTask>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTask[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTaskIdentifier(task: Pick<ITask, 'id'>): number {
    return task.id;
  }

  compareTask(o1: Pick<ITask, 'id'> | null, o2: Pick<ITask, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskIdentifier(o1) === this.getTaskIdentifier(o2) : o1 === o2;
  }

  addTaskToCollectionIfMissing<Type extends Pick<ITask, 'id'>>(
    taskCollection: Type[],
    ...tasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tasks: Type[] = tasksToCheck.filter(isPresent);
    if (tasks.length > 0) {
      const taskCollectionIdentifiers = taskCollection.map(taskItem => this.getTaskIdentifier(taskItem)!);
      const tasksToAdd = tasks.filter(taskItem => {
        const taskIdentifier = this.getTaskIdentifier(taskItem);
        if (taskCollectionIdentifiers.includes(taskIdentifier)) {
          return false;
        }
        taskCollectionIdentifiers.push(taskIdentifier);
        return true;
      });
      return [...tasksToAdd, ...taskCollection];
    }
    return taskCollection;
  }

  protected convertDateFromClient<T extends ITask | NewTask | PartialUpdateTask>(task: T): RestOf<T> {
    return {
      ...task,
      startDate: task.startDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restTask: RestTask): ITask {
    return {
      ...restTask,
      startDate: restTask.startDate ? dayjs(restTask.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTask>): HttpResponse<ITask> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTask[]>): HttpResponse<ITask[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
