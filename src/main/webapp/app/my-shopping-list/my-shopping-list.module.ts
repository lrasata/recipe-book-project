import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared/shared.module";
import { MyShoppingListComponent } from "./my-shopping-list.component";
import { MY_SHP_LIST_ROUTE } from "./my-shopping-list.route";

@NgModule({
    imports: [SharedModule, RouterModule.forChild([MY_SHP_LIST_ROUTE])],
    declarations: [MyShoppingListComponent]
  })
  export class MyShoppingListModule {}