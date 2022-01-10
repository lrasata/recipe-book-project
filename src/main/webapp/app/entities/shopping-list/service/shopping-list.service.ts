import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShoppingList, getShoppingListIdentifier } from '../shopping-list.model';

export type EntityResponseType = HttpResponse<IShoppingList>;
export type EntityArrayResponseType = HttpResponse<IShoppingList[]>;

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shopping-lists');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shoppingList: IShoppingList): Observable<EntityResponseType> {
    return this.http.post<IShoppingList>(this.resourceUrl, shoppingList, { observe: 'response' });
  }

  update(shoppingList: IShoppingList): Observable<EntityResponseType> {
    return this.http.put<IShoppingList>(`${this.resourceUrl}/${getShoppingListIdentifier(shoppingList) as number}`, shoppingList, {
      observe: 'response',
    });
  }

  partialUpdate(shoppingList: IShoppingList): Observable<EntityResponseType> {
    return this.http.patch<IShoppingList>(`${this.resourceUrl}/${getShoppingListIdentifier(shoppingList) as number}`, shoppingList, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShoppingList>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShoppingList[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShoppingListToCollectionIfMissing(
    shoppingListCollection: IShoppingList[],
    ...shoppingListsToCheck: (IShoppingList | null | undefined)[]
  ): IShoppingList[] {
    const shoppingLists: IShoppingList[] = shoppingListsToCheck.filter(isPresent);
    if (shoppingLists.length > 0) {
      const shoppingListCollectionIdentifiers = shoppingListCollection.map(
        shoppingListItem => getShoppingListIdentifier(shoppingListItem)!
      );
      const shoppingListsToAdd = shoppingLists.filter(shoppingListItem => {
        const shoppingListIdentifier = getShoppingListIdentifier(shoppingListItem);
        if (shoppingListIdentifier == null || shoppingListCollectionIdentifiers.includes(shoppingListIdentifier)) {
          return false;
        }
        shoppingListCollectionIdentifiers.push(shoppingListIdentifier);
        return true;
      });
      return [...shoppingListsToAdd, ...shoppingListCollection];
    }
    return shoppingListCollection;
  }
}
