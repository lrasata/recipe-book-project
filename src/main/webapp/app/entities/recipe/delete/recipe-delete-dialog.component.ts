import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRecipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';

@Component({
  templateUrl: './recipe-delete-dialog.component.html',
})
export class RecipeDeleteDialogComponent {
  recipe?: IRecipe;

  constructor(protected recipeService: RecipeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.recipeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
