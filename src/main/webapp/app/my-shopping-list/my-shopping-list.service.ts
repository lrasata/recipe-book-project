import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { ShoppingStatus } from "app/entities/enumerations/shopping-status.model";
import { getShoppingListIdentifier, IShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { Observable } from "rxjs";

export type EntityArrayResponseType = HttpResponse<IShoppingList[]>;
export type EntityResponseType = HttpResponse<IShoppingList>;

@Injectable({ providedIn: 'root' })
export class MyShoppingListService {
    protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rcb');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

    update(shoppingList: IShoppingList): Observable<EntityResponseType> {
      return this.http.put<IShoppingList>(`${this.resourceUrl}/shopping-lists/${getShoppingListIdentifier(shoppingList) as number}`, shoppingList, {
        observe: 'response',
      });
    }

    order(shoppingList: IShoppingList): Observable<EntityResponseType> {
        return this.http.put<HttpResponse<IShoppingList>>(`${this.resourceUrl}/shopping-lists/${getShoppingListIdentifier(shoppingList) as number}/order`, {
          observe: 'response',
        });
      }

    queryByUserLogin(userLogin: string): Observable<EntityArrayResponseType> {
        return this.http.get<IShoppingList[]>(
            this.resourceUrl + '/user/' + userLogin + '/shopping-lists', 
            { observe: 'response' });
      }
    
    queryByStatusAndUserLogin(userLogin: string, status: ShoppingStatus): Observable<EntityArrayResponseType> {
        return this.http.get<IShoppingList[]>(
            this.resourceUrl + '/user/' + userLogin + '/shopping-lists/' + status, 
            { observe: 'response' });
      }
    
    
}