import { DatePipe } from '@angular/common';
export class Registration {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public langKey: string,
    public firstName: string,
    public lastName: string,
    public code: string,
    public status: string,
    public phoneNumber: string,
    public dateOfBirth: string,
    public streetAddress?: string,
    public postalCode?: string,
    public city?: string,
    public region?: string,
    public country?: string
  ) {}
}
