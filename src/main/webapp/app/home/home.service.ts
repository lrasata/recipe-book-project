import { HttpClient, HttpResponse } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { IRecipe, Recipe } from "app/entities/recipe/recipe.model";
import { IShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { Observable } from "rxjs";

export type EntityArrayResponseType = HttpResponse<IRecipe[]>;

@Injectable({providedIn: 'root'})
export class HomeService {
    recipeSelected = new EventEmitter<Recipe>();
    protected resourceUrlRecipe = this.applicationConfigService.getEndpointFor('api/rcb/recipes');
    protected resourceUrlShoppingList = this.applicationConfigService.getEndpointFor('api/rcb/shopping-lists');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

    queryRecipeList(): Observable<EntityArrayResponseType> {
        return this.http.get<IRecipe[]>(this.resourceUrlRecipe, {observe: 'response' });
      }
    
    addIngredientToMyShoppingList(shoppingList: IShoppingList): Observable<HttpResponse<IShoppingList>> {
        return this.http.post<IShoppingList>(this.resourceUrlShoppingList, shoppingList, { observe: 'response' });
      }
}