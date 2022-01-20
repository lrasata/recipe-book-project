import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { UserManagementService } from "app/admin/user-management/service/user-management.service";
import { User } from "app/admin/user-management/user-management.model";
import { ShoppingStatus } from "app/entities/enumerations/shopping-status.model";
import { IngredientOrder } from "app/entities/ingredient-order/ingredient-order.model";
import { Ingredient } from "app/entities/ingredient/ingredient.model";
import { Recipe } from "app/entities/recipe/recipe.model";
import { IShoppingList, ShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';
import { HomeService } from "../home.service";

@Component({
    selector: 'jhi-home-recipe-detail',
    templateUrl: './home-recipe-detail.component.html'
  })
  export class HomeRecipeDetailComponent implements OnInit {
    @Input() recipe: Recipe = {};
    @Input() accountLogin = '';
    user : User = {};
    isSaving = false;

    constructor(
      private userManagementService: UserManagementService, 
      private homeService: HomeService){}
    
      ngOnInit(): void {
        this.userManagementService.find(this.accountLogin).subscribe((user) => {
          this.user = user;
        });
      }

    addIngredientToShoppingList(): void {
        const shoppingList = new ShoppingList();
        shoppingList.user = new User(this.user.id, this.user.login);
        shoppingList.shoppingStatus = ShoppingStatus.DRAFT;

        const ingredients = this.recipe.ingredients ?? [];
        const ingredientOrders: IngredientOrder[] = [];
        for (const i of ingredients) {
          const iOrder = new IngredientOrder();

          iOrder.ingredient = new Ingredient();
          iOrder.ingredient.id = i.id;
          iOrder.ingredient.amount = i.amount;
          iOrder.ingredient.name = i.name;

          iOrder.amountOrder = i.amount;
          ingredientOrders.push(iOrder);
        }
        this.subscribeToSaveResponse(this.homeService.addIngredientToMyShoppingList(shoppingList));
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IShoppingList>>): void {
      result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
        next: () => this.onSaveSuccess(),
        error: () => this.onSaveError(),
      });
    }
  
    protected onSaveSuccess(): void {
      // Api for inheritance.
    }
  
    protected onSaveError(): void {
      // Api for inheritance.
    }
  
    protected onSaveFinalize(): void {
      this.isSaving = false;
    }

  }