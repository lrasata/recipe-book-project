import { HttpClient, HttpResponse } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { IRecipe, Recipe } from "app/entities/recipe/recipe.model";
import { Observable } from "rxjs";

export type EntityArrayResponseType = HttpResponse<IRecipe[]>;

@Injectable({providedIn: 'root'})
export class HomeService {
    recipeSelected = new EventEmitter<Recipe>();
    protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rcb/recipes');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

    queryRecipeList(): Observable<EntityArrayResponseType> {
        return this.http.get<IRecipe[]>(this.resourceUrl, {observe: 'response' });
      }
}