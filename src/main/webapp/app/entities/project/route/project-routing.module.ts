import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProjectComponent } from '../list/project.component';
import { ProjectDetailComponent } from '../detail/project-detail.component';
import { ProjectUpdateComponent } from '../update/project-update.component';
import { ProjectRoutingResolveService } from './project-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';
import { ListCompanyDepartmentsComponent } from '../../department/list-company-departments/list-company-departments.component';
import { ListCompanyProjectsComponent } from '../list-company-projects/list-company-projects.component';
import { CreateDepartmentComponent } from '../../department/create-department/create-department.component';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectInfoComponent } from '../project-info/project-info.component';

const projectRoute: Routes = [
  {
    path: '',
    component: ProjectComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectDetailComponent,
    resolve: {
      project: ProjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/info',
    component: ProjectInfoComponent,
    resolve: {
      project: ProjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectUpdateComponent,
    resolve: {
      project: ProjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectUpdateComponent,
    resolve: {
      project: ProjectRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'company',
    component: ListCompanyProjectsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'create/:id',
    component: CreateProjectComponent,
    // resolve: {
    //   department: DepartmentRoutingResolveService,
    // },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectRoute)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
