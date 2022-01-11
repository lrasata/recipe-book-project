import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { HomeRecipeItemComponent } from './home-recipe-item/home-recipe-item.component';
import { HomeRecipeDetailComponent } from './home-recipe-detail/home-recipe-detail.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, HomeRecipeItemComponent, HomeRecipeDetailComponent]
})
export class HomeModule {}
