import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PhaseComponent } from './list/phase.component';
import { PhaseDetailComponent } from './detail/phase-detail.component';
import { PhaseUpdateComponent } from './update/phase-update.component';
import { PhaseDeleteDialogComponent } from './delete/phase-delete-dialog.component';
import { PhaseRoutingModule } from './route/phase-routing.module';

@NgModule({
  imports: [SharedModule, PhaseRoutingModule],
  declarations: [PhaseComponent, PhaseDetailComponent, PhaseUpdateComponent, PhaseDeleteDialogComponent],
})
export class PhaseModule {}
