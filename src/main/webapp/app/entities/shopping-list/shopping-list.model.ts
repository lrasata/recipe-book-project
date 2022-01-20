import { IUser } from 'app/entities/user/user.model';
import { IIngredientOrder } from 'app/entities/ingredient-order/ingredient-order.model';
import { ShoppingStatus } from 'app/entities/enumerations/shopping-status.model';

export interface IShoppingList {
  id?: number;
  shoppingStatus?: ShoppingStatus;
  user?: IUser | null;
  ingredientOrders?: IIngredientOrder[] | null;
}

export class ShoppingList implements IShoppingList {
  constructor(
    public id?: number,
    public shoppingStatus?: ShoppingStatus,
    public user?: IUser | null,
    public ingredientOrders?: IIngredientOrder[] | null
  ) {}
}

export function getShoppingListIdentifier(shoppingList: IShoppingList): number | undefined {
  return shoppingList.id;
}
