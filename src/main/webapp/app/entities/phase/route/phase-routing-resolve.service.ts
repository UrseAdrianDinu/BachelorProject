import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPhase } from '../phase.model';
import { PhaseService } from '../service/phase.service';

@Injectable({ providedIn: 'root' })
export class PhaseRoutingResolveService implements Resolve<IPhase | null> {
  constructor(protected service: PhaseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPhase | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((phase: HttpResponse<IPhase>) => {
          if (phase.body) {
            return of(phase.body);
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
