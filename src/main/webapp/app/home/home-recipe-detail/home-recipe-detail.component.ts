import { Component, Input } from "@angular/core";
import { UserManagementService } from "app/admin/user-management/service/user-management.service";
import { User } from "app/admin/user-management/user-management.model";
import { Recipe } from "app/entities/recipe/recipe.model";
import { ShoppingListService } from "app/entities/shopping-list/service/shopping-list.service";
import { ShoppingList } from "app/entities/shopping-list/shopping-list.model";

@Component({
    selector: 'jhi-home-recipe-detail',
    templateUrl: './home-recipe-detail.component.html'
  })
  export class HomeRecipeDetailComponent {
    @Input() recipe: Recipe = {};
    @Input() accountLogin = '';
    user : User = {};

    constructor(
      private userManagementService: UserManagementService, 
      private shoppingListService: ShoppingListService){}

    addIngredientToShoppingList(): void {
      this.userManagementService.find(this.accountLogin).subscribe((user) => {
        this.user = user;
        const shoppingList = new ShoppingList();
        shoppingList.user = new User(this.user.id, this.user.login);
        shoppingList.ingredients = this.recipe.ingredients?.slice();
        this.shoppingListService.create(shoppingList);
      });
    }

  }