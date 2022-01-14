import { Route } from "@angular/router";
import { MyShoppingListComponent } from "./my-shopping-list.component";

export const MY_SHP_LIST_ROUTE: Route = {
    path: 'my-shopping-list',
    component: MyShoppingListComponent,
    data: {
      pageTitle: 'home.title',
    },
  };