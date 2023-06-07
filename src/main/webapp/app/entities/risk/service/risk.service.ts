import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRisk, NewRisk } from '../risk.model';

export type PartialUpdateRisk = Partial<IRisk> & Pick<IRisk, 'id'>;

export type EntityResponseType = HttpResponse<IRisk>;
export type EntityArrayResponseType = HttpResponse<IRisk[]>;

@Injectable({ providedIn: 'root' })
export class RiskService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/risks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(risk: NewRisk): Observable<EntityResponseType> {
    return this.http.post<IRisk>(this.resourceUrl, risk, { observe: 'response' });
  }

  createRiskPhase(risk: NewRisk, phaseId: number): Observable<EntityResponseType> {
    return this.http.post<IRisk>(`${this.resourceUrl}/phase/${phaseId}`, risk, { observe: 'response' });
  }

  update(risk: IRisk): Observable<EntityResponseType> {
    return this.http.put<IRisk>(`${this.resourceUrl}/${this.getRiskIdentifier(risk)}`, risk, { observe: 'response' });
  }

  partialUpdate(risk: PartialUpdateRisk): Observable<EntityResponseType> {
    return this.http.patch<IRisk>(`${this.resourceUrl}/${this.getRiskIdentifier(risk)}`, risk, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRisk>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRisk[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRiskIdentifier(risk: Pick<IRisk, 'id'>): number {
    return risk.id;
  }

  compareRisk(o1: Pick<IRisk, 'id'> | null, o2: Pick<IRisk, 'id'> | null): boolean {
    return o1 && o2 ? this.getRiskIdentifier(o1) === this.getRiskIdentifier(o2) : o1 === o2;
  }

  addRiskToCollectionIfMissing<Type extends Pick<IRisk, 'id'>>(
    riskCollection: Type[],
    ...risksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const risks: Type[] = risksToCheck.filter(isPresent);
    if (risks.length > 0) {
      const riskCollectionIdentifiers = riskCollection.map(riskItem => this.getRiskIdentifier(riskItem)!);
      const risksToAdd = risks.filter(riskItem => {
        const riskIdentifier = this.getRiskIdentifier(riskItem);
        if (riskCollectionIdentifiers.includes(riskIdentifier)) {
          return false;
        }
        riskCollectionIdentifiers.push(riskIdentifier);
        return true;
      });
      return [...risksToAdd, ...riskCollection];
    }
    return riskCollection;
  }
}
