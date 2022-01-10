import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShoppingListComponent } from './list/shopping-list.component';
import { ShoppingListDetailComponent } from './detail/shopping-list-detail.component';
import { ShoppingListUpdateComponent } from './update/shopping-list-update.component';
import { ShoppingListDeleteDialogComponent } from './delete/shopping-list-delete-dialog.component';
import { ShoppingListRoutingModule } from './route/shopping-list-routing.module';

@NgModule({
  imports: [SharedModule, ShoppingListRoutingModule],
  declarations: [ShoppingListComponent, ShoppingListDetailComponent, ShoppingListUpdateComponent, ShoppingListDeleteDialogComponent],
  entryComponents: [ShoppingListDeleteDialogComponent],
})
export class ShoppingListModule {}
