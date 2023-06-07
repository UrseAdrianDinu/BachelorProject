import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { AccountExt } from '../../../core/auth/account-ext.model';
import { finalize } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PersonService } from '../../person/service/person.service';
import { IPerson } from '../../person/person.model';
import { CompanyFormGroup, CompanyFormService } from '../update/company-form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../service/company.service';
import { RoleService } from '../../role/service/role.service';
import { ICompany, NewCompany } from '../company.model';
import { HttpResponse } from '@angular/common/http';
import { IRole, NewRole } from '../../role/role.model';
import { RoleSeniority } from '../../enumerations/role-seniority.model';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-company-register',
  templateUrl: './company-register.component.html',
  styleUrls: ['./company-register.component.scss'],
})
export class CompanyRegisterComponent implements OnInit, OnDestroy {
  account: AccountExt | null = null;
  person!: IPerson | null;

  private readonly destroy$ = new Subject<void>();

  isSaving = false;

  selectOptions = ['Option 1', 'Option 2', 'Option 3'];

  selectedOption: string = ''; // Set the initial value to an empty string or the desired default value

  editForm: CompanyFormGroup = this.companyFormService.createCompanyFormGroup();

  private modalRef: NgbModal | undefined;

  private role: NewRole | undefined;

  constructor(
    private accountService: AccountService,
    private personService: PersonService,
    protected companyFormService: CompanyFormService,
    private modalService: NgbModal,
    protected companyService: CompanyService,
    protected roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.account = this.accountService.getUserExt();
    this.person = this.accountService.getPerson();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(content: any) {
    this.modalService.open(content);
  }

  createCompanyAndRole() {
    this.isSaving = true;
    const company = this.companyFormService.getCompany(this.editForm) as NewCompany;
    const parts = this.selectedOption.split(' ');
    const codeRole = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase() + parts[2].charAt(0).toUpperCase();
    const nr: NewRole = { id: null, name: this.selectedOption, code: codeRole, seniority: RoleSeniority.SENIOR };
    this.subscribeToSaveResponse(this.companyService.createCompanyAndAddRole(company, nr, this.person!.id));
  }

  save() {
    console.log(this.selectedOption);
    this.isSaving = true;
    const company = this.companyFormService.getCompany(this.editForm);
    if (company.id !== null) {
      this.subscribeToSaveResponseCompany(this.companyService.update(company));
    } else {
      this.subscribeToSaveResponseCompany(this.companyService.create(company));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<any>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessRole(),
      error: () => this.onSaveError(),
    });
  }

  previousState(): void {
    //console.log(this.selectedOption);
    // window.history.back();
    this.router.navigate(['']);
  }

  protected subscribeToSaveResponseCompany(result: Observable<HttpResponse<ICompany>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessCompany(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccessCompany(): void {
    // this.previousState();
    console.log('SAVE COMPANY');
    const parts = this.selectedOption.split(' ');
    const codeRole = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase() + parts[2].charAt(0).toUpperCase();
    const nr: NewRole = { id: null, name: this.selectedOption, code: codeRole, seniority: RoleSeniority.SENIOR };
    this.subscribeToSaveResponseRole(this.roleService.create(nr));
  }

  protected subscribeToSaveResponseRole(result: Observable<HttpResponse<IRole>>): void {
    console.log('SAVE ROLE');

    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccessRole(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  // openPopup(): void {
  //   this.dialog.open(PopupComponent);
  // }

  selectChangeHandler($event: Event) {
    const target = $event.target as HTMLSelectElement;
    this.selectedOption = target?.value;
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  private onSaveSuccessRole() {
    this.accountService.triggerButtonClicked();
    this.previousState();
    //const navbarRoute = ''; // Use the appropriate route for the navbar component
    //this.router.navigate([{ outlets: { navbar: navbarRoute } }]);
    //this.router.navigate(['']);
    //this.router.navigate([{ outlets: { navbar: '' } }]);
  }

  selectAnswer(answer: boolean) {
    if (answer) {
      // Yes button clicked
      console.log('Yes');
    } else {
      // No button clicked
      console.log('No');
      this.previousState();
    }
    this.modalService.dismissAll();
  }
}
