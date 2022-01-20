import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIngredientOrder, getIngredientOrderIdentifier } from '../ingredient-order.model';

export type EntityResponseType = HttpResponse<IIngredientOrder>;
export type EntityArrayResponseType = HttpResponse<IIngredientOrder[]>;

@Injectable({ providedIn: 'root' })
export class IngredientOrderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ingredient-orders');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ingredientOrder: IIngredientOrder): Observable<EntityResponseType> {
    return this.http.post<IIngredientOrder>(this.resourceUrl, ingredientOrder, { observe: 'response' });
  }

  update(ingredientOrder: IIngredientOrder): Observable<EntityResponseType> {
    return this.http.put<IIngredientOrder>(
      `${this.resourceUrl}/${getIngredientOrderIdentifier(ingredientOrder) as number}`,
      ingredientOrder,
      { observe: 'response' }
    );
  }

  partialUpdate(ingredientOrder: IIngredientOrder): Observable<EntityResponseType> {
    return this.http.patch<IIngredientOrder>(
      `${this.resourceUrl}/${getIngredientOrderIdentifier(ingredientOrder) as number}`,
      ingredientOrder,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIngredientOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIngredientOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIngredientOrderToCollectionIfMissing(
    ingredientOrderCollection: IIngredientOrder[],
    ...ingredientOrdersToCheck: (IIngredientOrder | null | undefined)[]
  ): IIngredientOrder[] {
    const ingredientOrders: IIngredientOrder[] = ingredientOrdersToCheck.filter(isPresent);
    if (ingredientOrders.length > 0) {
      const ingredientOrderCollectionIdentifiers = ingredientOrderCollection.map(
        ingredientOrderItem => getIngredientOrderIdentifier(ingredientOrderItem)!
      );
      const ingredientOrdersToAdd = ingredientOrders.filter(ingredientOrderItem => {
        const ingredientOrderIdentifier = getIngredientOrderIdentifier(ingredientOrderItem);
        if (ingredientOrderIdentifier == null || ingredientOrderCollectionIdentifiers.includes(ingredientOrderIdentifier)) {
          return false;
        }
        ingredientOrderCollectionIdentifiers.push(ingredientOrderIdentifier);
        return true;
      });
      return [...ingredientOrdersToAdd, ...ingredientOrderCollection];
    }
    return ingredientOrderCollection;
  }
}
