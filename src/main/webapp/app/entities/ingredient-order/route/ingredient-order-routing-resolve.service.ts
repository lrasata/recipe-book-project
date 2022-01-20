import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIngredientOrder, IngredientOrder } from '../ingredient-order.model';
import { IngredientOrderService } from '../service/ingredient-order.service';

@Injectable({ providedIn: 'root' })
export class IngredientOrderRoutingResolveService implements Resolve<IIngredientOrder> {
  constructor(protected service: IngredientOrderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIngredientOrder> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ingredientOrder: HttpResponse<IngredientOrder>) => {
          if (ingredientOrder.body) {
            return of(ingredientOrder.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new IngredientOrder());
  }
}
