import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIngredient, Ingredient } from 'app/entities/ingredient/ingredient.model';
import { ShoppingStatus } from 'app/entities/enumerations/shopping-status.model';
import { IShoppingList, ShoppingList } from 'app/entities/shopping-list/shopping-list.model';
import { MyShoppingListService } from '../my-shopping-list.service';
import { IngredientOrder } from 'app/entities/ingredient-order/ingredient-order.model';
import { IngredientOrderService } from 'app/entities/ingredient-order/service/ingredient-order.service';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';
import { ShoppingListService } from 'app/entities/shopping-list/service/shopping-list.service';

@Component({
  selector: 'jhi-my-shopping-list-update',
  templateUrl: './my-shopping-list-update.component.html',
})
export class MyShoppingListUpdateComponent implements OnInit {
  isSaving = false;
  shoppingStatusValues = Object.keys(ShoppingStatus);
  initialShoppingList : ShoppingList = {};

  ingredientsSharedCollection: IIngredient[] = [];
  isIngredientAddOrRemoveClicked = false;
  isAmountOnChange = false;

  editForm = this.fb.group({
    id: [],
    shoppingStatus: [null, [Validators.required]],
    user: [],
    ingredientOrders: [],
    ingredients: []
  });

  constructor(
    protected myShoppingListService: MyShoppingListService,
    protected shoppingListService: ShoppingListService,
    protected userService: UserService,
    protected ingredientService: IngredientService,
    protected ingredientOrderService: IngredientOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shoppingList }) => {
      this.updateForm(shoppingList);
      this.initialShoppingList = shoppingList;
      this.loadRelationshipsOptions();
    });
  }
  
  onClickIngredientAddOrRemove(): void {
    this.isIngredientAddOrRemoveClicked = !this.isIngredientAddOrRemoveClicked;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shoppingList = this.createFromForm();
    if (shoppingList.id !== undefined) {
      this.subscribeToSaveResponse(this.myShoppingListService.update(shoppingList));
    } 
  }

  addAndSaveIngredients(): void {
    this.isSaving = true;
    const shoppingList =  new ShoppingList();
    shoppingList.id = this.editForm.get(['id'])!.value;
    shoppingList.shoppingStatus = this.editForm.get(['shoppingStatus'])!.value;
    shoppingList.user = this.editForm.get(['user'])!.value;

    const ingredientList = this.editForm.get(['ingredients'])!.value;
    const ingredientOrders: IngredientOrder[] = [];

    for (const i of ingredientList) {
      const iOrder = new IngredientOrder();

      iOrder.ingredient = new Ingredient();
      iOrder.ingredient.id = i.id;
      iOrder.ingredient.amount = i.amount;
      iOrder.ingredient.name = i.name;

      iOrder.amountOrder = i.amount;
      ingredientOrders.push(iOrder);
      
    }
    shoppingList.ingredientOrders = ingredientOrders;

    if (shoppingList.id !== undefined) {
      this.subscribeToSaveResponse(this.myShoppingListService.update(shoppingList));
    } 
  }

  removeIngredientandSaveOverwriteShoppingList(ingredientOrder: IngredientOrder): void {
    this.isSaving = true;
    const shoppingList = this.createFromForm();
    if (shoppingList.ingredientOrders) {
      shoppingList.ingredientOrders = shoppingList.ingredientOrders.filter(obj => obj.id !== ingredientOrder.id);
    }

    if (shoppingList.id !== undefined) {
      this.subscribeToSaveResponse(this.shoppingListService.update(shoppingList));
    } 
  }
  changeAmount(): void{
    this.isAmountOnChange = !this.isAmountOnChange;
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackIngredientById(index: number, item: IIngredient): number {
    return item.id!;
  }

  getSelectedIngredient(option: IIngredient, selectedVals?: IIngredient[]): IIngredient {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShoppingList>>): void {
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

  protected loadRelationshipsOptions(): void {

    this.ingredientService
      .query()
      .pipe(map((res: HttpResponse<IIngredient[]>) => res.body ?? []))
      .pipe(
        map((ingredients: IIngredient[]) =>
          this.ingredientService.addIngredientToCollectionIfMissing(ingredients, ...(this.editForm.get('ingredients')!.value ?? []))
        )
      )
      .subscribe((ingredients: IIngredient[]) => (this.ingredientsSharedCollection = ingredients));
  }

  protected updateForm(shoppingList: IShoppingList): void {
    this.editForm.patchValue({
      id: shoppingList.id,
      shoppingStatus: shoppingList.shoppingStatus,
      user: shoppingList.user,
      ingredientOrders: shoppingList.ingredientOrders,
    });
  }


  protected createFromForm(): IShoppingList {
    return {
      ...new ShoppingList(),
      id: this.editForm.get(['id'])!.value,
      shoppingStatus: this.editForm.get(['shoppingStatus'])!.value,
      user: this.editForm.get(['user'])!.value,
      ingredientOrders: this.initialShoppingList.ingredientOrders,
    };
  }
}
