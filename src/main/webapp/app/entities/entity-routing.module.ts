import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'person',
        data: { pageTitle: 'People' },
        loadChildren: () => import('./person/person.module').then(m => m.PersonModule),
      },
      {
        path: 'company',
        data: { pageTitle: 'Companies' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'project',
        data: { pageTitle: 'Projects' },
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'phase',
        data: { pageTitle: 'Phases' },
        loadChildren: () => import('./phase/phase.module').then(m => m.PhaseModule),
      },
      {
        path: 'risk',
        data: { pageTitle: 'Risks' },
        loadChildren: () => import('./risk/risk.module').then(m => m.RiskModule),
      },
      {
        path: 'team',
        data: { pageTitle: 'Teams' },
        loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
      },
      {
        path: 'task',
        data: { pageTitle: 'Tasks' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'sprint',
        data: { pageTitle: 'Sprints' },
        loadChildren: () => import('./sprint/sprint.module').then(m => m.SprintModule),
      },
      {
        path: 'department',
        data: { pageTitle: 'Departments' },
        loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
      },
      {
        path: 'role',
        data: { pageTitle: 'Roles' },
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
