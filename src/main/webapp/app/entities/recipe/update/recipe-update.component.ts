import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRecipe, Recipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';

@Component({
  selector: 'jhi-recipe-update',
  templateUrl: './recipe-update.component.html',
})
export class RecipeUpdateComponent implements OnInit {
  isSaving = false;

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
