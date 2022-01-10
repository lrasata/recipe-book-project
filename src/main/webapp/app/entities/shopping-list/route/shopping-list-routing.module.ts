import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShoppingListComponent } from '../list/shopping-list.component';
import { ShoppingListDetailComponent } from '../detail/shopping-list-detail.component';
import { ShoppingListUpdateComponent } from '../update/shopping-list-update.component';
import { ShoppingListRoutingResolveService } from './shopping-list-routing-resolve.service';

const shoppingListRoute: Routes = [
  {
    path: '',
    component: ShoppingListComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShoppingListDetailComponent,
    resolve: {
      shoppingList: ShoppingListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShoppingListUpdateComponent,
    resolve: {
      shoppingList: ShoppingListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShoppingListUpdateComponent,
    resolve: {
      shoppingList: ShoppingListRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shoppingListRoute)],
  exports: [RouterModule],
})
export class ShoppingListRoutingModule {}
