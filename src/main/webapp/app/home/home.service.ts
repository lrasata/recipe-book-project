import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "app/entities/recipe/recipe.model";

@Injectable({providedIn: 'root'})
export class HomeService {
    recipeSelected = new EventEmitter<Recipe>();
}