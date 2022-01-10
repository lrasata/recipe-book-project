import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IngredientComponent } from './list/ingredient.component';
import { IngredientDetailComponent } from './detail/ingredient-detail.component';
import { IngredientUpdateComponent } from './update/ingredient-update.component';
import { IngredientDeleteDialogComponent } from './delete/ingredient-delete-dialog.component';
import { IngredientRoutingModule } from './route/ingredient-routing.module';

@NgModule({
  imports: [SharedModule, IngredientRoutingModule],
  declarations: [IngredientComponent, IngredientDetailComponent, IngredientUpdateComponent, IngredientDeleteDialogComponent],
  entryComponents: [IngredientDeleteDialogComponent],
})
export class IngredientModule {}
