import { Component, Input } from '@angular/core';
import { Recipe } from 'app/entities/recipe/recipe.model';
import { HomeService } from '../home.service';


@Component({
  selector: 'jhi-home-recipe-item',
  templateUrl: './home-recipe-item.component.html',
  styleUrls: ['./home-recipe-item.component.css']
})
export class HomeRecipeItemComponent {
  @Input() recipe: Recipe = {};

  constructor(private homeService: HomeService){}

  onSelectRecipeItem(): void {
    this.recipe.isSelected = !this.recipe.isSelected;
    this.homeService.recipeSelected.emit(this.recipe);
  }
}