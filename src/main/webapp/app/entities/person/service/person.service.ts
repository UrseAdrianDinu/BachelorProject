import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPerson, NewPerson } from '../person.model';
import { IUser, User } from '../../user/user.model';
import { AccountExt } from '../../../core/auth/account-ext.model';
import { ICompany } from '../../company/company.model';
import { IDepartment } from '../../department/department.model';
import { IRole } from '../../role/role.model';
import { IPersonUser } from '../list-company-people/person-user.model';
import { IPhase } from '../../phase/phase.model';

export type PartialUpdatePerson = Partial<IPerson> & Pick<IPerson, 'id'>;

type RestOf<T extends IPerson | NewPerson> = Omit<T, 'hireDate' | 'dateOfBirth'> & {
  hireDate?: string | null;
  dateOfBirth?: string | null;
};

export type RestPerson = RestOf<IPerson>;

export type NewRestPerson = RestOf<NewPerson>;

export type PartialUpdateRestPerson = RestOf<PartialUpdatePerson>;

export type EntityResponseType = HttpResponse<IPerson>;
export type EntityArrayResponseType = HttpResponse<IPerson[]>;

@Injectable({ providedIn: 'root' })
export class PersonService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/people');
  protected resourceUrlCompany = this.applicationConfigService.getEndpointFor('api/companies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(person: NewPerson): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(person);
    return this.http
      .post<RestPerson>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(person: IPerson): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(person);
    return this.http
      .put<RestPerson>(`${this.resourceUrl}/${this.getPersonIdentifier(person)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(person: PartialUpdatePerson): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(person);
    return this.http
      .patch<RestPerson>(`${this.resourceUrl}/${this.getPersonIdentifier(person)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  getPersonByUser(userId: bigint): Observable<EntityResponseType> {
    return this.http
      .get<RestPerson>(`${this.resourceUrl}/user/${userId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  getPersonCompany(companyId: number): Observable<HttpResponse<ICompany>> {
    return this.http
      .get<ICompany>(`${this.resourceUrl}/company/${companyId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  getPersonRole(userId: number): Observable<HttpResponse<IRole>> {
    return this.http
      .get<ICompany>(`${this.resourceUrl}/role/${userId}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  addPersonTeam(personId: number, teamId: number): Observable<EntityResponseType> {
    return this.http.put<IPerson>(`${this.resourceUrl}/${personId}/team/${teamId}`, null, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPerson>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPerson[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  queryByCompany(companyId: number, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPerson[]>(`${this.resourceUrlCompany}/people/${companyId}`, { params: options, observe: 'response' });
  }

  queryPeopleUserByCompany(companyId: number, req?: any): Observable<HttpResponse<IPersonUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPersonUser[]>(`${this.resourceUrlCompany}/people-users/${companyId}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPersonIdentifier(person: Pick<IPerson, 'id'>): number {
    return person.id;
  }

  comparePerson(o1: Pick<IPerson, 'id'> | null, o2: Pick<IPerson, 'id'> | null): boolean {
    return o1 && o2 ? this.getPersonIdentifier(o1) === this.getPersonIdentifier(o2) : o1 === o2;
  }

  addPersonToCollectionIfMissing<Type extends Pick<IPerson, 'id'>>(
    personCollection: Type[],
    ...peopleToCheck: (Type | null | undefined)[]
  ): Type[] {
    const people: Type[] = peopleToCheck.filter(isPresent);
    if (people.length > 0) {
      const personCollectionIdentifiers = personCollection.map(personItem => this.getPersonIdentifier(personItem)!);
      const peopleToAdd = people.filter(personItem => {
        const personIdentifier = this.getPersonIdentifier(personItem);
        if (personCollectionIdentifiers.includes(personIdentifier)) {
          return false;
        }
        personCollectionIdentifiers.push(personIdentifier);
        return true;
      });
      return [...peopleToAdd, ...personCollection];
    }
    return personCollection;
  }

  protected convertDateFromClient<T extends IPerson | NewPerson | PartialUpdatePerson>(person: T): RestOf<T> {
    return {
      ...person,
      hireDate: person.hireDate?.format(DATE_FORMAT) ?? null,
      dateOfBirth: person.dateOfBirth?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPerson: RestPerson): IPerson {
    return {
      ...restPerson,
      hireDate: restPerson.hireDate ? dayjs(restPerson.hireDate) : undefined,
      dateOfBirth: restPerson.dateOfBirth ? dayjs(restPerson.dateOfBirth) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPerson>): HttpResponse<IPerson> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPerson[]>): HttpResponse<IPerson[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
