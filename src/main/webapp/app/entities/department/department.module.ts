import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DepartmentComponent } from './list/department.component';
import { DepartmentDetailComponent } from './detail/department-detail.component';
import { DepartmentUpdateComponent } from './update/department-update.component';
import { DepartmentDeleteDialogComponent } from './delete/department-delete-dialog.component';
import { DepartmentRoutingModule } from './route/department-routing.module';
import { ListCompanyDepartmentsComponent } from './list-company-departments/list-company-departments.component';
import { CreateDepartmentComponent } from './create-department/create-department.component';

@NgModule({
  imports: [SharedModule, DepartmentRoutingModule],
  declarations: [
    DepartmentComponent,
    DepartmentDetailComponent,
    DepartmentUpdateComponent,
    DepartmentDeleteDialogComponent,
    ListCompanyDepartmentsComponent,
    CreateDepartmentComponent,
  ],
})
export class DepartmentModule {}
