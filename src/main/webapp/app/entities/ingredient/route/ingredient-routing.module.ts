import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IngredientComponent } from '../list/ingredient.component';
import { IngredientDetailComponent } from '../detail/ingredient-detail.component';
import { IngredientUpdateComponent } from '../update/ingredient-update.component';
import { IngredientRoutingResolveService } from './ingredient-routing-resolve.service';

const ingredientRoute: Routes = [
  {
    path: '',
    component: IngredientComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IngredientDetailComponent,
    resolve: {
      ingredient: IngredientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IngredientUpdateComponent,
    resolve: {
      ingredient: IngredientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IngredientUpdateComponent,
    resolve: {
      ingredient: IngredientRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ingredientRoute)],
  exports: [RouterModule],
})
export class IngredientRoutingModule {}
