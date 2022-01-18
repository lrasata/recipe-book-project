import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AccountService } from "app/core/auth/account.service";
import { SharedModule } from "app/shared/shared.module";
import { MyShoppingListComponent } from "./my-shopping-list.component";
import { MyShoppingListRoute } from "./my-shopping-list.route";
import { MyShoppingListService } from "./my-shopping-list.service";
import { MyShoppingListUpdateComponent } from "./update/my-shopping-list-update.component";

@NgModule({
    imports: [
      SharedModule, 
      FormsModule,
      MyShoppingListRoute
    ],
    declarations: [MyShoppingListComponent, MyShoppingListUpdateComponent],
    providers : [AccountService, MyShoppingListService]
  })
  export class MyShoppingListModule {}