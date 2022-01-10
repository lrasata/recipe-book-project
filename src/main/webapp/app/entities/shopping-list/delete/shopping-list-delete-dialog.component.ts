import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../service/shopping-list.service';

@Component({
  templateUrl: './shopping-list-delete-dialog.component.html',
})
export class ShoppingListDeleteDialogComponent {
  shoppingList?: IShoppingList;

  constructor(protected shoppingListService: ShoppingListService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shoppingListService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
