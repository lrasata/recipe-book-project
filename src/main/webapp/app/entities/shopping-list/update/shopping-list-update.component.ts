import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IShoppingList, ShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../service/shopping-list.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIngredientOrder } from 'app/entities/ingredient-order/ingredient-order.model';
import { IngredientOrderService } from 'app/entities/ingredient-order/service/ingredient-order.service';
import { ShoppingStatus } from 'app/entities/enumerations/shopping-status.model';

@Component({
  selector: 'jhi-shopping-list-update',
  templateUrl: './shopping-list-update.component.html',
})
export class ShoppingListUpdateComponent implements OnInit {
  isSaving = false;
  shoppingStatusValues = Object.keys(ShoppingStatus);

  usersSharedCollection: IUser[] = [];
  ingredientOrdersSharedCollection: IIngredientOrder[] = [];

  editForm = this.fb.group({
    id: [],
    shoppingStatus: [null, [Validators.required]],
    user: [],
    ingredientOrders: [],
  });

  constructor(
    protected shoppingListService: ShoppingListService,
    protected userService: UserService,
    protected ingredientOrderService: IngredientOrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shoppingList }) => {
      this.updateForm(shoppingList);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shoppingList = this.createFromForm();
    if (shoppingList.id !== undefined) {
      this.subscribeToSaveResponse(this.shoppingListService.update(shoppingList));
    } else {
      this.subscribeToSaveResponse(this.shoppingListService.create(shoppingList));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackIngredientOrderById(index: number, item: IIngredientOrder): number {
    return item.id!;
  }

  getSelectedIngredientOrder(option: IIngredientOrder, selectedVals?: IIngredientOrder[]): IIngredientOrder {
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

  protected updateForm(shoppingList: IShoppingList): void {
    this.editForm.patchValue({
      id: shoppingList.id,
      shoppingStatus: shoppingList.shoppingStatus,
      user: shoppingList.user,
      ingredientOrders: shoppingList.ingredientOrders,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, shoppingList.user);
    this.ingredientOrdersSharedCollection = this.ingredientOrderService.addIngredientOrderToCollectionIfMissing(
      this.ingredientOrdersSharedCollection,
      ...(shoppingList.ingredientOrders ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.ingredientOrderService
      .query()
      .pipe(map((res: HttpResponse<IIngredientOrder[]>) => res.body ?? []))
      .pipe(
        map((ingredientOrders: IIngredientOrder[]) =>
          this.ingredientOrderService.addIngredientOrderToCollectionIfMissing(
            ingredientOrders,
            ...(this.editForm.get('ingredientOrders')!.value ?? [])
          )
        )
      )
      .subscribe((ingredientOrders: IIngredientOrder[]) => (this.ingredientOrdersSharedCollection = ingredientOrders));
  }

  protected createFromForm(): IShoppingList {
    return {
      ...new ShoppingList(),
      id: this.editForm.get(['id'])!.value,
      shoppingStatus: this.editForm.get(['shoppingStatus'])!.value,
      user: this.editForm.get(['user'])!.value,
      ingredientOrders: this.editForm.get(['ingredientOrders'])!.value,
    };
  }
}
