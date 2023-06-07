import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRisk } from '../risk.model';
import { RiskService } from '../service/risk.service';

@Injectable({ providedIn: 'root' })
export class RiskRoutingResolveService implements Resolve<IRisk | null> {
  constructor(protected service: RiskService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRisk | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((risk: HttpResponse<IRisk>) => {
          if (risk.body) {
            return of(risk.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
