import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhase, NewPhase } from '../phase.model';
import { CreateProject } from '../../project/create-project/create-project.model';
import { CreatePhase } from './create-phase.model';
import { IRisk } from '../../risk/risk.model';

export type PartialUpdatePhase = Partial<IPhase> & Pick<IPhase, 'id'>;

type RestOf<T extends IPhase | NewPhase> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestPhase = RestOf<IPhase>;

export type NewRestPhase = RestOf<NewPhase>;

export type PartialUpdateRestPhase = RestOf<PartialUpdatePhase>;

export type EntityResponseType = HttpResponse<IPhase>;
export type EntityArrayResponseType = HttpResponse<IPhase[]>;

@Injectable({ providedIn: 'root' })
export class PhaseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/phases');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(phase: NewPhase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phase);
    return this.http.post<RestPhase>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  createPhaseProject(phase: CreatePhase, projectId: number): Observable<EntityResponseType> {
    return this.http.post<IPhase>(`${this.resourceUrl}/project/${projectId}`, phase, { observe: 'response' });
  }

  setPhaseActive(phaseId: number): Observable<EntityResponseType> {
    return this.http.put<IPhase>(`${this.resourceUrl}/${phaseId}/active`, null, { observe: 'response' });
  }

  update(phase: IPhase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phase);
    return this.http
      .put<RestPhase>(`${this.resourceUrl}/${this.getPhaseIdentifier(phase)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(phase: PartialUpdatePhase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(phase);
    return this.http
      .patch<RestPhase>(`${this.resourceUrl}/${this.getPhaseIdentifier(phase)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPhase>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  findPhaseRisks(projectId: number): Observable<HttpResponse<IRisk[]>> {
    return this.http.get<IRisk[]>(`${this.resourceUrl}/${projectId}/risks`, { observe: 'response' });
  }

  findPhaseSprints(projectId: number): Observable<HttpResponse<IRisk[]>> {
    return this.http.get<IRisk[]>(`${this.resourceUrl}/${projectId}/sprints`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPhase[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPhaseIdentifier(phase: Pick<IPhase, 'id'>): number {
    return phase.id;
  }

  comparePhase(o1: Pick<IPhase, 'id'> | null, o2: Pick<IPhase, 'id'> | null): boolean {
    return o1 && o2 ? this.getPhaseIdentifier(o1) === this.getPhaseIdentifier(o2) : o1 === o2;
  }

  addPhaseToCollectionIfMissing<Type extends Pick<IPhase, 'id'>>(
    phaseCollection: Type[],
    ...phasesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const phases: Type[] = phasesToCheck.filter(isPresent);
    if (phases.length > 0) {
      const phaseCollectionIdentifiers = phaseCollection.map(phaseItem => this.getPhaseIdentifier(phaseItem)!);
      const phasesToAdd = phases.filter(phaseItem => {
        const phaseIdentifier = this.getPhaseIdentifier(phaseItem);
        if (phaseCollectionIdentifiers.includes(phaseIdentifier)) {
          return false;
        }
        phaseCollectionIdentifiers.push(phaseIdentifier);
        return true;
      });
      return [...phasesToAdd, ...phaseCollection];
    }
    return phaseCollection;
  }

  protected convertDateFromClient<T extends IPhase | NewPhase | PartialUpdatePhase>(phase: T): RestOf<T> {
    return {
      ...phase,
      startDate: phase.startDate?.format(DATE_FORMAT) ?? null,
      endDate: phase.endDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPhase: RestPhase): IPhase {
    return {
      ...restPhase,
      startDate: restPhase.startDate ? dayjs(restPhase.startDate) : undefined,
      endDate: restPhase.endDate ? dayjs(restPhase.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPhase>): HttpResponse<IPhase> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPhase[]>): HttpResponse<IPhase[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
