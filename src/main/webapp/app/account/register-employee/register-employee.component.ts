import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterService } from '../register/register.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from '../../config/error.constants';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../../entities/company/service/company.service';
import { RegistrationEmployee } from '../register/registerEmployee.model';

@Component({
  selector: 'jhi-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss'],
})
export class RegisterEmployeeComponent implements OnInit, AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  selectedRole: string = ''; // Set the initial value to an empty string or the desired default value
  selectedSeniority: string = ''; // Set the initial value to an empty string or the desired default value
  selectedDepartment: string = ''; // Set the initial value to an empty string or the desired default value
  companyId: number | null = null;
  departmentNames: string[] = [];

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
    salary: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    hireDate: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    employeeRole: new FormControl('', {
      nonNullable: false,
      validators: [Validators.required],
    }),
    roleSeniority: new FormControl('', {
      nonNullable: false,
      validators: [Validators.required],
    }),
    departmentName: new FormControl('', {
      nonNullable: false,
      validators: [Validators.required],
    }),
  });

  constructor(private registerService: RegisterService, private route: ActivatedRoute, private companyService: CompanyService) {}

  ngOnInit(): void {
    console.log('dada', this.selectedDepartment);
    this.route.paramMap.subscribe(params => {
      this.companyId = +params.get('id')!;

      this.companyService.getDepartmentNames(this.companyId!).subscribe(res => {
        this.departmentNames = res.body!;
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  registerEmployee(): void {
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      const formValue = this.registerForm.value;
      const lastName = formValue.lastName;
      const firstName = formValue.firstName;
      const code = lastName!.substring(0, 2).concat(firstName!.substring(0, 2)).toUpperCase();
      console.log(formValue);
      const parts = this.selectedRole.split(' ');
      let codeRole: string = '';
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        codeRole += part.charAt(0);
      }
      const registrationEmployee: RegistrationEmployee = new RegistrationEmployee(
        formValue.login!,
        formValue.email!,
        formValue.password!,
        'en',
        formValue.firstName!,
        formValue.lastName!,
        code,
        'ACTIVE',
        formValue.phoneNumber!,
        formValue.dateOfBirth!,
        formValue.streetAddress!,
        formValue.postalCode!,
        formValue.city!,
        formValue.region!,
        formValue.country!,
        parseInt(formValue.salary!, 10),
        formValue.hireDate!,
        formValue.employeeRole!,
        formValue.roleSeniority!,
        codeRole,
        formValue.departmentName!
      );
      this.registerService.saveEmployee(registrationEmployee, this.companyId!).subscribe({
        next: () => {
          this.success = true;
          this.previousState();
        },
        error: response => this.processError(response),
      });
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

  selectChangeHandlerRole($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedRole = target?.value;
  }

  selectChangeHandlerSeniority($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedSeniority = target?.value;
  }
  selectChangeHandlerDepartment($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedDepartment = target?.value;
  }

  previousState() {
    console.log(this.selectedRole);
    window.history.back();
  }
}
