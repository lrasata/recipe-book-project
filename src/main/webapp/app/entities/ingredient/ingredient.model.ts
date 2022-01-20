import { IRecipe } from 'app/entities/recipe/recipe.model';

export interface IIngredient {
  id?: number;
  name?: string;
  amount?: number;
  recipes?: IRecipe[] | null;
}

export class Ingredient implements IIngredient {
  constructor(public id?: number, public name?: string, public amount?: number, public recipes?: IRecipe[] | null) {}
}

export function getIngredientIdentifier(ingredient: IIngredient): number | undefined {
  return ingredient.id;
}
