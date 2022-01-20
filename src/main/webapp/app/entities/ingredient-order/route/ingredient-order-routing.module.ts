import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IngredientOrderComponent } from '../list/ingredient-order.component';
import { IngredientOrderDetailComponent } from '../detail/ingredient-order-detail.component';
import { IngredientOrderUpdateComponent } from '../update/ingredient-order-update.component';
import { IngredientOrderRoutingResolveService } from './ingredient-order-routing-resolve.service';

const ingredientOrderRoute: Routes = [
  {
    path: '',
    component: IngredientOrderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IngredientOrderDetailComponent,
    resolve: {
      ingredientOrder: IngredientOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IngredientOrderUpdateComponent,
    resolve: {
      ingredientOrder: IngredientOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IngredientOrderUpdateComponent,
    resolve: {
      ingredientOrder: IngredientOrderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ingredientOrderRoute)],
  exports: [RouterModule],
})
export class IngredientOrderRoutingModule {}
