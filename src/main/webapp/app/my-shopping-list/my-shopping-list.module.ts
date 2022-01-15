import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AccountService } from "app/core/auth/account.service";
import { SharedModule } from "app/shared/shared.module";
import { MyShoppingListComponent } from "./my-shopping-list.component";
import { MY_SHP_LIST_ROUTE } from "./my-shopping-list.route";
import { MyShoppingListService } from "./my-shopping-list.service";

@NgModule({
    imports: [SharedModule, RouterModule.forChild([MY_SHP_LIST_ROUTE])],
    declarations: [MyShoppingListComponent],
    providers : [AccountService, MyShoppingListService]
  })
  export class MyShoppingListModule {}