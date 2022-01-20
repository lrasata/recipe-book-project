import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIngredientOrder, IngredientOrder } from '../ingredient-order.model';
import { IngredientOrderService } from '../service/ingredient-order.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';
import { IShoppingList } from 'app/entities/shopping-list/shopping-list.model';
import { ShoppingListService } from 'app/entities/shopping-list/service/shopping-list.service';

@Component({
  selector: 'jhi-ingredient-order-update',
  templateUrl: './ingredient-order-update.component.html',
})
export class IngredientOrderUpdateComponent implements OnInit {
  isSaving = false;

  ingredientsSharedCollection: IIngredient[] = [];
  shoppingListsSharedCollection: IShoppingList[] = [];

  editForm = this.fb.group({
    id: [],
    amountOrder: [],
    ingredient: [],
    shoppingList: [],
  });

  constructor(
    protected ingredientOrderService: IngredientOrderService,
    protected ingredientService: IngredientService,
    protected shoppingListService: ShoppingListService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingredientOrder }) => {
      this.updateForm(ingredientOrder);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ingredientOrder = this.createFromForm();
    if (ingredientOrder.id !== undefined) {
      this.subscribeToSaveResponse(this.ingredientOrderService.update(ingredientOrder));
    } else {
      this.subscribeToSaveResponse(this.ingredientOrderService.create(ingredientOrder));
    }
  }

  trackIngredientById(index: number, item: IIngredient): number {
    return item.id!;
  }

  trackShoppingListById(index: number, item: IShoppingList): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIngredientOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(ingredientOrder: IIngredientOrder): void {
    this.editForm.patchValue({
      id: ingredientOrder.id,
      amountOrder: ingredientOrder.amountOrder,
      ingredient: ingredientOrder.ingredient,
      shoppingList: ingredientOrder.shoppingList,
    });

    this.ingredientsSharedCollection = this.ingredientService.addIngredientToCollectionIfMissing(
      this.ingredientsSharedCollection,
      ingredientOrder.ingredient
    );
    this.shoppingListsSharedCollection = this.shoppingListService.addShoppingListToCollectionIfMissing(
      this.shoppingListsSharedCollection,
      ingredientOrder.shoppingList
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ingredientService
      .query()
      .pipe(map((res: HttpResponse<IIngredient[]>) => res.body ?? []))
      .pipe(
        map((ingredients: IIngredient[]) =>
          this.ingredientService.addIngredientToCollectionIfMissing(ingredients, this.editForm.get('ingredient')!.value)
        )
      )
      .subscribe((ingredients: IIngredient[]) => (this.ingredientsSharedCollection = ingredients));

    this.shoppingListService
      .query()
      .pipe(map((res: HttpResponse<IShoppingList[]>) => res.body ?? []))
      .pipe(
        map((shoppingLists: IShoppingList[]) =>
          this.shoppingListService.addShoppingListToCollectionIfMissing(shoppingLists, this.editForm.get('shoppingList')!.value)
        )
      )
      .subscribe((shoppingLists: IShoppingList[]) => (this.shoppingListsSharedCollection = shoppingLists));
  }

  protected createFromForm(): IIngredientOrder {
    return {
      ...new IngredientOrder(),
      id: this.editForm.get(['id'])!.value,
      amountOrder: this.editForm.get(['amountOrder'])!.value,
      ingredient: this.editForm.get(['ingredient'])!.value,
      shoppingList: this.editForm.get(['shoppingList'])!.value,
    };
  }
}
