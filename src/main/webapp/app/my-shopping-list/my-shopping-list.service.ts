import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { IShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { Observable } from "rxjs";

export type EntityArrayResponseType = HttpResponse<IShoppingList[]>;

@Injectable({ providedIn: 'root' })
export class MyShoppingListService {
    protected resourceUrl = this.applicationConfigService.getEndpointFor('api/rcb');

    constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

    queryByUserLogin(userLogin: string): Observable<EntityArrayResponseType> {
        return this.http.get<IShoppingList[]>(
            this.resourceUrl + '/user/' + userLogin + 'shopping-lists', 
            { observe: 'response' });
      }
}