import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'recipe',
        data: { pageTitle: 'recipebookApp.recipe.home.title' },
        loadChildren: () => import('./recipe/recipe.module').then(m => m.RecipeModule),
      },
      {
        path: 'ingredient',
        data: { pageTitle: 'recipebookApp.ingredient.home.title' },
        loadChildren: () => import('./ingredient/ingredient.module').then(m => m.IngredientModule),
      },
      {
        path: 'shopping-list',
        data: { pageTitle: 'recipebookApp.shoppingList.home.title' },
        loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule),
      },
      {
        path: 'ingredient-order',
        data: { pageTitle: 'recipebookApp.ingredientOrder.home.title' },
        loadChildren: () => import('./ingredient-order/ingredient-order.module').then(m => m.IngredientOrderModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
