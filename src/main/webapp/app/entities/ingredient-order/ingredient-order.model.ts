import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IShoppingList } from 'app/entities/shopping-list/shopping-list.model';

export interface IIngredientOrder {
  id?: number;
  amountOrder?: number | null;
  ingredient?: IIngredient | null;
  shoppingList?: IShoppingList | null;
}

export class IngredientOrder implements IIngredientOrder {
  constructor(
    public id?: number,
    public amountOrder?: number | null,
    public ingredient?: IIngredient | null,
    public shoppingList?: IShoppingList | null
  ) {}
}

export function getIngredientOrderIdentifier(ingredientOrder: IIngredientOrder): number | undefined {
  return ingredientOrder.id;
}
