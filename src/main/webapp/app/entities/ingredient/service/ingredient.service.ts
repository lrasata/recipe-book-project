import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIngredient, getIngredientIdentifier } from '../ingredient.model';

export type EntityResponseType = HttpResponse<IIngredient>;
export type EntityArrayResponseType = HttpResponse<IIngredient[]>;

@Injectable({ providedIn: 'root' })
export class IngredientService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ingredients');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ingredient: IIngredient): Observable<EntityResponseType> {
    return this.http.post<IIngredient>(this.resourceUrl, ingredient, { observe: 'response' });
  }

  update(ingredient: IIngredient): Observable<EntityResponseType> {
    return this.http.put<IIngredient>(`${this.resourceUrl}/${getIngredientIdentifier(ingredient) as number}`, ingredient, {
      observe: 'response',
    });
  }

  partialUpdate(ingredient: IIngredient): Observable<EntityResponseType> {
    return this.http.patch<IIngredient>(`${this.resourceUrl}/${getIngredientIdentifier(ingredient) as number}`, ingredient, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIngredient>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIngredient[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIngredientToCollectionIfMissing(
    ingredientCollection: IIngredient[],
    ...ingredientsToCheck: (IIngredient | null | undefined)[]
  ): IIngredient[] {
    const ingredients: IIngredient[] = ingredientsToCheck.filter(isPresent);
    if (ingredients.length > 0) {
      const ingredientCollectionIdentifiers = ingredientCollection.map(ingredientItem => getIngredientIdentifier(ingredientItem)!);
      const ingredientsToAdd = ingredients.filter(ingredientItem => {
        const ingredientIdentifier = getIngredientIdentifier(ingredientItem);
        if (ingredientIdentifier == null || ingredientCollectionIdentifiers.includes(ingredientIdentifier)) {
          return false;
        }
        ingredientCollectionIdentifiers.push(ingredientIdentifier);
        return true;
      });
      return [...ingredientsToAdd, ...ingredientCollection];
    }
    return ingredientCollection;
  }
}
