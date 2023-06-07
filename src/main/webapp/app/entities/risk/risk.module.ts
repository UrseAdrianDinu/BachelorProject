import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RiskComponent } from './list/risk.component';
import { RiskDetailComponent } from './detail/risk-detail.component';
import { RiskUpdateComponent } from './update/risk-update.component';
import { RiskDeleteDialogComponent } from './delete/risk-delete-dialog.component';
import { RiskRoutingModule } from './route/risk-routing.module';

@NgModule({
  imports: [SharedModule, RiskRoutingModule],
  declarations: [RiskComponent, RiskDetailComponent, RiskUpdateComponent, RiskDeleteDialogComponent],
})
export class RiskModule {}
