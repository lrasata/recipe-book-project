import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IShoppingList } from 'app/entities/shopping-list/shopping-list.model';

export interface IIngredientOrder {
  id?: number;
  amountOrder?: number;
  ingredient?: IIngredient | null;
  shoppingLists?: IShoppingList[] | null;
}

export class IngredientOrder implements IIngredientOrder {
  constructor(
    public id?: number,
    public amountOrder?: number,
    public ingredient?: IIngredient | null,
    public shoppingLists?: IShoppingList[] | null
  ) {}
}

export function getIngredientOrderIdentifier(ingredientOrder: IIngredientOrder): number | undefined {
  return ingredientOrder.id;
}
