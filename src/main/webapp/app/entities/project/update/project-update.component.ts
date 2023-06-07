import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProjectFormService, ProjectFormGroup } from './project-form.service';
import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';
import { ITeam } from 'app/entities/team/team.model';
import { TeamService } from 'app/entities/team/service/team.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';

@Component({
  selector: 'jhi-project-update',
  templateUrl: './project-update.component.html',
})
export class ProjectUpdateComponent implements OnInit {
  isSaving = false;
  project: IProject | null = null;
  projectStatusValues = Object.keys(ProjectStatus);

  teamsSharedCollection: ITeam[] = [];
  companiesSharedCollection: ICompany[] = [];

  editForm: ProjectFormGroup = this.projectFormService.createProjectFormGroup();

  constructor(
    protected projectService: ProjectService,
    protected projectFormService: ProjectFormService,
    protected teamService: TeamService,
    protected companyService: CompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTeam = (o1: ITeam | null, o2: ITeam | null): boolean => this.teamService.compareTeam(o1, o2);

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      if (project) {
        this.updateForm(project);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.projectFormService.getProject(this.editForm);
    if (project.id !== null) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
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

  protected updateForm(project: IProject): void {
    this.project = project;
    this.projectFormService.resetForm(this.editForm, project);

    this.teamsSharedCollection = this.teamService.addTeamToCollectionIfMissing<ITeam>(this.teamsSharedCollection, ...(project.teams ?? []));
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      project.company
    );
  }

  protected loadRelationshipsOptions(): void {
    this.teamService
      .query()
      .pipe(map((res: HttpResponse<ITeam[]>) => res.body ?? []))
      .pipe(map((teams: ITeam[]) => this.teamService.addTeamToCollectionIfMissing<ITeam>(teams, ...(this.project?.teams ?? []))))
      .subscribe((teams: ITeam[]) => (this.teamsSharedCollection = teams));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.project?.company)))
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}
