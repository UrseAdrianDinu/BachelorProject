import { Route } from '@angular/router';

import { RegisterEmployeeComponent } from './register-employee.component';

export const registerEmployeeRoute: Route = {
  path: 'register-employee/:id',
  component: RegisterEmployeeComponent,
  data: {
    pageTitle: 'Employee Registration',
  },
};
