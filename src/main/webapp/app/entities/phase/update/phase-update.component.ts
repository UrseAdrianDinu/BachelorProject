import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PhaseFormService, PhaseFormGroup } from './phase-form.service';
import { IPhase } from '../phase.model';
import { PhaseService } from '../service/phase.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

@Component({
  selector: 'jhi-phase-update',
  templateUrl: './phase-update.component.html',
})
export class PhaseUpdateComponent implements OnInit {
  isSaving = false;
  phase: IPhase | null = null;

  projectsSharedCollection: IProject[] = [];

  editForm: PhaseFormGroup = this.phaseFormService.createPhaseFormGroup();

  constructor(
    protected phaseService: PhaseService,
    protected phaseFormService: PhaseFormService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phase }) => {
      this.phase = phase;
      if (phase) {
        this.updateForm(phase);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const phase = this.phaseFormService.getPhase(this.editForm);
    if (phase.id !== null) {
      this.subscribeToSaveResponse(this.phaseService.update(phase));
    } else {
      this.subscribeToSaveResponse(this.phaseService.create(phase));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhase>>): void {
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

  protected updateForm(phase: IPhase): void {
    this.phase = phase;
    this.phaseFormService.resetForm(this.editForm, phase);

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      phase.project
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.phase?.project)))
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }
}
