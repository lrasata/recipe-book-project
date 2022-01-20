import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IngredientOrderComponent } from './list/ingredient-order.component';
import { IngredientOrderDetailComponent } from './detail/ingredient-order-detail.component';
import { IngredientOrderUpdateComponent } from './update/ingredient-order-update.component';
import { IngredientOrderDeleteDialogComponent } from './delete/ingredient-order-delete-dialog.component';
import { IngredientOrderRoutingModule } from './route/ingredient-order-routing.module';

@NgModule({
  imports: [SharedModule, IngredientOrderRoutingModule],
  declarations: [
    IngredientOrderComponent,
    IngredientOrderDetailComponent,
    IngredientOrderUpdateComponent,
    IngredientOrderDeleteDialogComponent,
  ],
  entryComponents: [IngredientOrderDeleteDialogComponent],
})
export class IngredientOrderModule {}
