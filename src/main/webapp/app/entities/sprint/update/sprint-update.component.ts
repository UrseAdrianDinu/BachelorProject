import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SprintFormService, SprintFormGroup } from './sprint-form.service';
import { ISprint } from '../sprint.model';
import { SprintService } from '../service/sprint.service';
import { IPhase } from 'app/entities/phase/phase.model';
import { PhaseService } from 'app/entities/phase/service/phase.service';
import { SprintStatus } from 'app/entities/enumerations/sprint-status.model';

@Component({
  selector: 'jhi-sprint-update',
  templateUrl: './sprint-update.component.html',
})
export class SprintUpdateComponent implements OnInit {
  isSaving = false;
  sprint: ISprint | null = null;
  sprintStatusValues = Object.keys(SprintStatus);

  phasesSharedCollection: IPhase[] = [];

  editForm: SprintFormGroup = this.sprintFormService.createSprintFormGroup();

  constructor(
    protected sprintService: SprintService,
    protected sprintFormService: SprintFormService,
    protected phaseService: PhaseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePhase = (o1: IPhase | null, o2: IPhase | null): boolean => this.phaseService.comparePhase(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sprint }) => {
      this.sprint = sprint;
      if (sprint) {
        this.updateForm(sprint);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const sprint = this.sprintFormService.getSprint(this.editForm);
    if (sprint.id !== null) {
      this.subscribeToSaveResponse(this.sprintService.update(sprint));
    } else {
      this.subscribeToSaveResponse(this.sprintService.create(sprint));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISprint>>): void {
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

  protected updateForm(sprint: ISprint): void {
    this.sprint = sprint;
    this.sprintFormService.resetForm(this.editForm, sprint);

    this.phasesSharedCollection = this.phaseService.addPhaseToCollectionIfMissing<IPhase>(this.phasesSharedCollection, sprint.phase);
  }

  protected loadRelationshipsOptions(): void {
    this.phaseService
      .query()
      .pipe(map((res: HttpResponse<IPhase[]>) => res.body ?? []))
      .pipe(map((phases: IPhase[]) => this.phaseService.addPhaseToCollectionIfMissing<IPhase>(phases, this.sprint?.phase)))
      .subscribe((phases: IPhase[]) => (this.phasesSharedCollection = phases));
  }
}
