import { IUser } from 'app/entities/user/user.model';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';

export interface IRecipe {
  id?: number;
  title?: string | null;
  description?: string | null;
  imagePath?: string | null;
  user?: IUser | null;
  ingredient?: IIngredient | null;
}

export class Recipe implements IRecipe {
  constructor(
    public id?: number,
    public title?: string | null,
    public description?: string | null,
    public imagePath?: string | null,
    public user?: IUser | null,
    public ingredient?: IIngredient | null
  ) {}
}

export function getRecipeIdentifier(recipe: IRecipe): number | undefined {
  return recipe.id;
}
