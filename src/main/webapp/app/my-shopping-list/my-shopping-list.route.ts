import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { ShoppingListRoutingResolveService } from "app/entities/shopping-list/route/shopping-list-routing-resolve.service";
import { MyShoppingListComponent } from "./my-shopping-list.component";
import { MyShoppingListUpdateComponent } from "./update/my-shopping-list-update.component";

const MY_SHP_LIST_ROUTE: Routes = [
    {path: 'my-shopping-list',
      component: MyShoppingListComponent,
      data: {
        pageTitle: 'home.title',
      },
    },
    {
      path: 'update-my-shopping-list/:id/edit',
      component: MyShoppingListUpdateComponent,
      resolve: {
        shoppingList: ShoppingListRoutingResolveService,
      },
      canActivate: [UserRouteAccessService],
    }

];

@NgModule({
  imports: [RouterModule.forChild(MY_SHP_LIST_ROUTE)],
  exports: [RouterModule],
})
export class MyShoppingListRoute{}