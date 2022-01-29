import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IRecipe, Recipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';


@Injectable({ providedIn: 'root' })
export class RcbRecipeRoutingResolveService implements Resolve<IRecipe> {
  constructor(protected service: RecipeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRecipe> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((recipe: HttpResponse<Recipe>) => {
          if (recipe.body) {
            return of(recipe.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Recipe());
  }
}
