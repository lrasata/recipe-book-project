import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecipe, getRecipeIdentifier } from '../recipe.model';

export type EntityResponseType = HttpResponse<IRecipe>;
export type EntityArrayResponseType = HttpResponse<IRecipe[]>;

@Injectable({ providedIn: 'root' })
export class RecipeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recipes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(recipe: IRecipe): Observable<EntityResponseType> {
    return this.http.post<IRecipe>(this.resourceUrl, recipe, { observe: 'response' });
  }

  update(recipe: IRecipe): Observable<EntityResponseType> {
    return this.http.put<IRecipe>(`${this.resourceUrl}/${getRecipeIdentifier(recipe) as number}`, recipe, { observe: 'response' });
  }

  partialUpdate(recipe: IRecipe): Observable<EntityResponseType> {
    return this.http.patch<IRecipe>(`${this.resourceUrl}/${getRecipeIdentifier(recipe) as number}`, recipe, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRecipe>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRecipe[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRecipeToCollectionIfMissing(recipeCollection: IRecipe[], ...recipesToCheck: (IRecipe | null | undefined)[]): IRecipe[] {
    const recipes: IRecipe[] = recipesToCheck.filter(isPresent);
    if (recipes.length > 0) {
      const recipeCollectionIdentifiers = recipeCollection.map(recipeItem => getRecipeIdentifier(recipeItem)!);
      const recipesToAdd = recipes.filter(recipeItem => {
        const recipeIdentifier = getRecipeIdentifier(recipeItem);
        if (recipeIdentifier == null || recipeCollectionIdentifiers.includes(recipeIdentifier)) {
          return false;
        }
        recipeCollectionIdentifiers.push(recipeIdentifier);
        return true;
      });
      return [...recipesToAdd, ...recipeCollection];
    }
    return recipeCollection;
  }
}
