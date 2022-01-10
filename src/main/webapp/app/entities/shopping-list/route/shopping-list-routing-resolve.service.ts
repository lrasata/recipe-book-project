import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShoppingList, ShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../service/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class ShoppingListRoutingResolveService implements Resolve<IShoppingList> {
  constructor(protected service: ShoppingListService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShoppingList> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shoppingList: HttpResponse<ShoppingList>) => {
          if (shoppingList.body) {
            return of(shoppingList.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ShoppingList());
  }
}
