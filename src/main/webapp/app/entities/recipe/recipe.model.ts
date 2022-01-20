import { IUser } from 'app/entities/user/user.model';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';

export interface IRecipe {
  id?: number;
  title?: string;
  description?: string | null;
  imagePath?: string | null;
  user?: IUser | null;
  ingredients?: IIngredient[] | null;
  isSelected?: boolean;
}

export class Recipe implements IRecipe {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string | null,
    public imagePath?: string | null,
    public user?: IUser | null,
    public ingredients?: IIngredient[] | null,
    public isSelected?: boolean
  ) {
    this.isSelected = false;
  }
}

export function getRecipeIdentifier(recipe: IRecipe): number | undefined {
  return recipe.id;
}
