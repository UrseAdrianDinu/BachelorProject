import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';
import { RegistrationEmployee } from './registerEmployee.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }

  saveEmployee(registrationEmployee: RegistrationEmployee, companyId: number): Observable<{}> {
    const url = this.applicationConfigService.getEndpointFor('api/register-employee') + `/${companyId}`;
    return this.http.post(url, registrationEmployee);
  }
}
