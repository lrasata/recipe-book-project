import { IRecipe } from 'app/entities/recipe/recipe.model';
import { IShoppingList } from 'app/entities/shopping-list/shopping-list.model';

export interface IIngredient {
  id?: number;
  name?: string | null;
  amount?: number | null;
  recipes?: IRecipe[] | null;
  shoppingLists?: IShoppingList[] | null;
}

export class Ingredient implements IIngredient {
  constructor(
    public id?: number,
    public name?: string | null,
    public amount?: number | null,
    public recipes?: IRecipe[] | null,
    public shoppingLists?: IShoppingList[] | null
  ) {}
}

export function getIngredientIdentifier(ingredient: IIngredient): number | undefined {
  return ingredient.id;
}
