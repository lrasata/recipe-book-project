import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'recipe',
        data: { pageTitle: 'recipebookApp.recipe.home.title' },
        loadChildren: () => import('./recipe/rcb-recipe.module').then(m => m.RcbRecipeModule),
      }
    ]),
  ],
})
export class RcbEntityRoutingModule {}
