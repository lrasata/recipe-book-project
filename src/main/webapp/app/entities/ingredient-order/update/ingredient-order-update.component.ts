import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IIngredientOrder, IngredientOrder } from '../ingredient-order.model';
import { IngredientOrderService } from '../service/ingredient-order.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';

@Component({
  selector: 'jhi-ingredient-order-update',
  templateUrl: './ingredient-order-update.component.html',
})
export class IngredientOrderUpdateComponent implements OnInit {
  isSaving = false;

  ingredientsSharedCollection: IIngredient[] = [];

  editForm = this.fb.group({
    id: [],
    amountOrder: [null, [Validators.required]],
    ingredient: [],
  });

  constructor(
    protected ingredientOrderService: IngredientOrderService,
    protected ingredientService: IngredientService,
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
    });

    this.ingredientsSharedCollection = this.ingredientService.addIngredientToCollectionIfMissing(
      this.ingredientsSharedCollection,
      ingredientOrder.ingredient
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
  }

  protected createFromForm(): IIngredientOrder {
    return {
      ...new IngredientOrder(),
      id: this.editForm.get(['id'])!.value,
      amountOrder: this.editForm.get(['amountOrder'])!.value,
      ingredient: this.editForm.get(['ingredient'])!.value,
    };
  }
}
