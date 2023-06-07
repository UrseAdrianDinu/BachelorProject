import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PhaseComponent } from '../list/phase.component';
import { PhaseDetailComponent } from '../detail/phase-detail.component';
import { PhaseUpdateComponent } from '../update/phase-update.component';
import { PhaseRoutingResolveService } from './phase-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const phaseRoute: Routes = [
  {
    path: '',
    component: PhaseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PhaseDetailComponent,
    resolve: {
      phase: PhaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PhaseUpdateComponent,
    resolve: {
      phase: PhaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PhaseUpdateComponent,
    resolve: {
      phase: PhaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(phaseRoute)],
  exports: [RouterModule],
})
export class PhaseRoutingModule {}
