import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompanyComponent } from './list/company.component';
import { CompanyDetailComponent } from './detail/company-detail.component';
import { CompanyUpdateComponent } from './update/company-update.component';
import { CompanyDeleteDialogComponent } from './delete/company-delete-dialog.component';
import { CompanyRoutingModule } from './route/company-routing.module';
import { CompanyRegisterComponent } from './register/company-register.component';

@NgModule({
  imports: [SharedModule, CompanyRoutingModule],
  declarations: [CompanyComponent, CompanyDetailComponent, CompanyUpdateComponent, CompanyDeleteDialogComponent, CompanyRegisterComponent],
})
export class CompanyModule {}
