import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')],
    }),
    dateOfBirth: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    streetAddress: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    postalCode: new FormControl('', {
      nonNullable: false,
      validators: [Validators.minLength(5), Validators.maxLength(5)],
    }),
    city: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    region: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    country: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
  });

  constructor(private registerService: RegisterService) {}

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      const { login, email, firstName, lastName, phoneNumber, dateOfBirth } = this.registerForm.getRawValue();
      const streetAddress = this.registerForm.get('streetAddress')?.value || '';
      const postalCode = this.registerForm.get('postalCode')?.value || '';
      const city = this.registerForm.get('city')?.value || '';
      const region = this.registerForm.get('region')?.value || '';
      const country = this.registerForm.get('country')?.value || '';
      const code = lastName.substring(0, 2).concat(firstName.substring(0, 2)).toUpperCase();
      this.registerService
        .save({
          login,
          email,
          password,
          langKey: 'en',
          firstName,
          lastName,
          code,
          status: 'ACTIVE',
          phoneNumber,
          dateOfBirth,
          streetAddress,
          postalCode,
          city,
          region,
          country,
        })
        .subscribe({ next: () => (this.success = true), error: response => this.processError(response) });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
}
