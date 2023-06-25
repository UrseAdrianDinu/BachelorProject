import { Component, OnInit } from '@angular/core';
import { IDepartment } from '../department.model';
import { ICompany } from '../../company/company.model';
import { DepartmentFormGroup, DepartmentFormService } from '../update/department-form.service';
import { DepartmentService } from '../service/department.service';
import { CompanyService } from '../../company/service/company.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss'],
})
export class CreateDepartmentComponent implements OnInit {
  isSaving = false;
  department: IDepartment | null = null;

  companiesSharedCollection: ICompany[] = [];

  companyId: number | null = null;
  departmentNames: string[] = [];

  editForm: DepartmentFormGroup = this.departmentFormService.createDepartmentFormGroup();

  createForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    code: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    description: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
    parentDept: new FormControl('', {
      nonNullable: false,
      validators: [],
    }),
  });

  constructor(
    protected departmentService: DepartmentService,
    protected departmentFormService: DepartmentFormService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.companyId = +params.get('id')!;

      this.companyService.getDepartmentNames(this.companyId!).subscribe(res => {
        this.departmentNames = res.body!;
      });
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.departmentService.createDeparmentCompany(this.createForm.getRawValue(), this.companyId!));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
