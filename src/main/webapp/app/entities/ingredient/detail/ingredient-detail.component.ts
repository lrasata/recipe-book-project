import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIngredient } from '../ingredient.model';

@Component({
  selector: 'jhi-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
})
export class IngredientDetailComponent implements OnInit {
  ingredient: IIngredient | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingredient }) => {
      this.ingredient = ingredient;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
