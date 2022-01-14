import { HttpResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { UserManagementService } from "app/admin/user-management/service/user-management.service";
import { User } from "app/admin/user-management/user-management.model";
import { Recipe } from "app/entities/recipe/recipe.model";
import { ShoppingListService } from "app/entities/shopping-list/service/shopping-list.service";
import { IShoppingList, ShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';

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
      private shoppingListService: ShoppingListService){}
    
      ngOnInit(): void {
        this.userManagementService.find(this.accountLogin).subscribe((user) => {
          this.user = user;
        });
      }

    addIngredientToShoppingList(): void {
        const shoppingList = new ShoppingList();
        shoppingList.user = new User(this.user.id, this.user.login);
        shoppingList.ingredients = this.recipe.ingredients?.slice();
        this.subscribeToSaveResponse(this.shoppingListService.create(shoppingList));
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