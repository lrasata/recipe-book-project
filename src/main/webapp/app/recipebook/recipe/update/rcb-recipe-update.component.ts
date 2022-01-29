import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';
import { IRecipe, Recipe } from 'app/entities/recipe/recipe.model';

@Component({
  selector: 'jhi-rcb-recipe-update',
  templateUrl: './rcb-recipe-update.component.html',
})
export class RcbRecipeUpdateComponent implements OnInit {
  isSaving = false;
  displayImagePath = '';

  usersSharedCollection: IUser[] = [];
  ingredientsSharedCollection: IIngredient[] = [];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    description: [],
    imagePath: [],
    user: [],
    ingredients: [],
  });

  constructor(
    protected recipeService: RecipeService,
    protected userService: UserService,
    protected ingredientService: IngredientService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipe }) => {
      this.updateForm(recipe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipe = this.createFromForm();
    if (recipe.id !== undefined) {
      this.subscribeToSaveResponse(this.recipeService.update(recipe));
    } else {
      this.subscribeToSaveResponse(this.recipeService.create(recipe));
    }
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

isImagePathFilled(): string {
    if (this.editForm.get('imagePath')?.value){
        return String(this.editForm.get('imagePath')?.value);
    }
    return '';
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipe>>): void {
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

  protected updateForm(recipe: IRecipe): void {
    this.editForm.patchValue({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      imagePath: recipe.imagePath,
      user: recipe.user,
      ingredients: recipe.ingredients,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, recipe.user);
    this.ingredientsSharedCollection = this.ingredientService.addIngredientToCollectionIfMissing(
      this.ingredientsSharedCollection,
      ...(recipe.ingredients ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

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

  protected createFromForm(): IRecipe {
    return {
      ...new Recipe(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      imagePath: this.editForm.get(['imagePath'])!.value,
      user: this.editForm.get(['user'])!.value,
      ingredients: this.editForm.get(['ingredients'])!.value,
    };
  }
}
