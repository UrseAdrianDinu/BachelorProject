import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RiskFormService, RiskFormGroup } from './risk-form.service';
import { IRisk } from '../risk.model';
import { RiskService } from '../service/risk.service';
import { IPhase } from 'app/entities/phase/phase.model';
import { PhaseService } from 'app/entities/phase/service/phase.service';
import { ProbabilityValue } from 'app/entities/enumerations/probability-value.model';

@Component({
  selector: 'jhi-risk-update',
  templateUrl: './risk-update.component.html',
})
export class RiskUpdateComponent implements OnInit {
  isSaving = false;
  risk: IRisk | null = null;
  probabilityValueValues = Object.keys(ProbabilityValue);

  phasesSharedCollection: IPhase[] = [];

  editForm: RiskFormGroup = this.riskFormService.createRiskFormGroup();

  constructor(
    protected riskService: RiskService,
    protected riskFormService: RiskFormService,
    protected phaseService: PhaseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePhase = (o1: IPhase | null, o2: IPhase | null): boolean => this.phaseService.comparePhase(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ risk }) => {
      this.risk = risk;
      if (risk) {
        this.updateForm(risk);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const risk = this.riskFormService.getRisk(this.editForm);
    if (risk.id !== null) {
      this.subscribeToSaveResponse(this.riskService.update(risk));
    } else {
      this.subscribeToSaveResponse(this.riskService.create(risk));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRisk>>): void {
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

  protected updateForm(risk: IRisk): void {
    this.risk = risk;
    this.riskFormService.resetForm(this.editForm, risk);

    this.phasesSharedCollection = this.phaseService.addPhaseToCollectionIfMissing<IPhase>(this.phasesSharedCollection, risk.phase);
  }

  protected loadRelationshipsOptions(): void {
    this.phaseService
      .query()
      .pipe(map((res: HttpResponse<IPhase[]>) => res.body ?? []))
      .pipe(map((phases: IPhase[]) => this.phaseService.addPhaseToCollectionIfMissing<IPhase>(phases, this.risk?.phase)))
      .subscribe((phases: IPhase[]) => (this.phasesSharedCollection = phases));
  }
}
