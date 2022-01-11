import { Component, Input } from "@angular/core";
import { Recipe } from "app/entities/recipe/recipe.model";

@Component({
    selector: 'jhi-home-recipe-detail',
    templateUrl: './home-recipe-detail.component.html'
  })
  export class HomeRecipeDetailComponent {
    @Input() recipe: Recipe = {};
  }