import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIngredientOrder } from '../ingredient-order.model';

@Component({
  selector: 'jhi-ingredient-order-detail',
  templateUrl: './ingredient-order-detail.component.html',
})
export class IngredientOrderDetailComponent implements OnInit {
  ingredientOrder: IIngredientOrder | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingredientOrder }) => {
      this.ingredientOrder = ingredientOrder;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
