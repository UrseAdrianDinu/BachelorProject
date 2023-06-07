import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPhase } from '../phase.model';

@Component({
  selector: 'jhi-phase-detail',
  templateUrl: './phase-detail.component.html',
})
export class PhaseDetailComponent implements OnInit {
  phase: IPhase | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ phase }) => {
      this.phase = phase;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
