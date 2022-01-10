import { IUser } from 'app/entities/user/user.model';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';

export interface IShoppingList {
  id?: number;
  user?: IUser | null;
  ingredient?: IIngredient | null;
}

export class ShoppingList implements IShoppingList {
  constructor(public id?: number, public user?: IUser | null, public ingredient?: IIngredient | null) {}
}

export function getShoppingListIdentifier(shoppingList: IShoppingList): number | undefined {
  return shoppingList.id;
}
