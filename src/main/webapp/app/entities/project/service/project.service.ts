import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProject, NewProject } from '../project.model';
import { IDepartment } from '../../department/department.model';
import { CreateDepartment } from '../../department/create-department/create-department.model';
import { CreateProject } from '../create-project/create-project.model';
import { IPhase } from '../../phase/phase.model';
import { ITeam } from '../../team/team.model';
import { IPersonUser } from '../../person/list-company-people/person-user.model';

export type PartialUpdateProject = Partial<IProject> & Pick<IProject, 'id'>;

type RestOf<T extends IProject | NewProject> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestProject = RestOf<IProject>;

export type NewRestProject = RestOf<NewProject>;

export type PartialUpdateRestProject = RestOf<PartialUpdateProject>;

export type EntityResponseType = HttpResponse<IProject>;
export type EntityArrayResponseType = HttpResponse<IProject[]>;

@Injectable({ providedIn: 'root' })
export class ProjectService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/projects');
  protected resourceUrlCompany = this.applicationConfigService.getEndpointFor('api/companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(project: NewProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http
      .post<RestProject>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createProjectCompany(project: CreateProject, companyId: number): Observable<EntityResponseType> {
    return this.http.post<IProject>(`${this.resourceUrl}/company/${companyId}`, project, { observe: 'response' });
  }

  update(project: IProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http
      .put<RestProject>(`${this.resourceUrl}/${this.getProjectIdentifier(project)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(project: PartialUpdateProject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(project);
    return this.http
      .patch<RestProject>(`${this.resourceUrl}/${this.getProjectIdentifier(project)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProject>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProject[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  queryByCompany(companyId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDepartment[]>(`${this.resourceUrlCompany}/projects/${companyId}`, { params: options, observe: 'response' });
  }

  getProjectPhases(id: number): Observable<HttpResponse<IPhase[]>> {
    return this.http.get<IPhase[]>(`${this.resourceUrl}/${id}/phases`, { observe: 'response' });
  }

  getProjectTeams(id: number): Observable<HttpResponse<ITeam[]>> {
    return this.http.get<IPhase[]>(`${this.resourceUrl}/${id}/teams`, { observe: 'response' });
  }

  getProjectPeopleUser(id: number): Observable<HttpResponse<IPersonUser[]>> {
    return this.http.get<IPersonUser[]>(`${this.resourceUrl}/people-users/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectIdentifier(project: Pick<IProject, 'id'>): number {
    return project.id;
  }

  compareProject(o1: Pick<IProject, 'id'> | null, o2: Pick<IProject, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectIdentifier(o1) === this.getProjectIdentifier(o2) : o1 === o2;
  }

  addProjectToCollectionIfMissing<Type extends Pick<IProject, 'id'>>(
    projectCollection: Type[],
    ...projectsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projects: Type[] = projectsToCheck.filter(isPresent);
    if (projects.length > 0) {
      const projectCollectionIdentifiers = projectCollection.map(projectItem => this.getProjectIdentifier(projectItem)!);
      const projectsToAdd = projects.filter(projectItem => {
        const projectIdentifier = this.getProjectIdentifier(projectItem);
        if (projectCollectionIdentifiers.includes(projectIdentifier)) {
          return false;
        }
        projectCollectionIdentifiers.push(projectIdentifier);
        return true;
      });
      return [...projectsToAdd, ...projectCollection];
    }
    return projectCollection;
  }

  protected convertDateFromClient<T extends IProject | NewProject | PartialUpdateProject>(project: T): RestOf<T> {
    return {
      ...project,
      startDate: project.startDate?.format(DATE_FORMAT) ?? null,
      endDate: project.endDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProject: RestProject): IProject {
    return {
      ...restProject,
      startDate: restProject.startDate ? dayjs(restProject.startDate) : undefined,
      endDate: restProject.endDate ? dayjs(restProject.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProject>): HttpResponse<IProject> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProject[]>): HttpResponse<IProject[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
