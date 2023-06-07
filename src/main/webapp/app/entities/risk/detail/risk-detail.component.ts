import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRisk } from '../risk.model';

@Component({
  selector: 'jhi-risk-detail',
  templateUrl: './risk-detail.component.html',
})
export class RiskDetailComponent implements OnInit {
  risk: IRisk | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ risk }) => {
      this.risk = risk;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
