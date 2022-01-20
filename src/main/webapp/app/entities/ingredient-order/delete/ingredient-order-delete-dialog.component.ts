import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIngredientOrder } from '../ingredient-order.model';
import { IngredientOrderService } from '../service/ingredient-order.service';

@Component({
  templateUrl: './ingredient-order-delete-dialog.component.html',
})
export class IngredientOrderDeleteDialogComponent {
  ingredientOrder?: IIngredientOrder;

  constructor(protected ingredientOrderService: IngredientOrderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ingredientOrderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
