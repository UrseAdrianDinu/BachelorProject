import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RiskComponent } from '../list/risk.component';
import { RiskDetailComponent } from '../detail/risk-detail.component';
import { RiskUpdateComponent } from '../update/risk-update.component';
import { RiskRoutingResolveService } from './risk-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const riskRoute: Routes = [
  {
    path: '',
    component: RiskComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RiskDetailComponent,
    resolve: {
      risk: RiskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RiskUpdateComponent,
    resolve: {
      risk: RiskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RiskUpdateComponent,
    resolve: {
      risk: RiskRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(riskRoute)],
  exports: [RouterModule],
})
export class RiskRoutingModule {}
