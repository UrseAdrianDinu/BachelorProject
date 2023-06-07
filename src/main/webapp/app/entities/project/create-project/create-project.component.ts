import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectStatus } from '../../enumerations/project-status.model';
import { DepartmentService } from '../../department/service/department.service';
import { DepartmentFormService } from '../../department/update/department-form.service';
import { CompanyService } from '../../company/service/company.service';
import { ProjectService } from '../service/project.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IDepartment } from '../../department/department.model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'jhi-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  isSaving = false;
  projectStatusValues = Object.keys(ProjectStatus);
  companyId: number | null = null;

  createForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    code: new FormControl('', {
      validators: [Validators.required],
    }),
    domain: new FormControl(''),
    description: new FormControl(''),
    startDate: new FormControl(''),
    billable: new FormControl(false),
  });
  constructor(protected projectService: ProjectService, protected activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.companyId = +params.get('id')!;
    });
  }

  save() {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.projectService.createProjectCompany(this.createForm.getRawValue(), this.companyId!));
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

  previousState(): void {
    window.history.back();
  }
}
