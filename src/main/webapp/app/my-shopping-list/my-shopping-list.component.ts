import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "app/admin/user-management/user-management.model";
import { Account } from "app/core/auth/account.model";
import { AccountService } from "app/core/auth/account.service";
import { IShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { Subject, takeUntil } from "rxjs";
import { MyShoppingListService } from "./my-shopping-list.service";

@Component({
    selector: 'jhi-myshoppinglist',
    templateUrl: './my-shopping-list.component.html'
  })
export class MyShoppingListComponent implements OnInit, OnDestroy {
    shoppingLists: IShoppingList[] =  [];
    user : User = {};
    account: Account | null = null;

    private readonly destroy$ = new Subject<void>();
    
    constructor(protected myShoppingListService: MyShoppingListService,
        private accountService: AccountService){
        this.shoppingLists = [];
    }
    ngOnInit(): void {
        this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => {
            this.account =  account;
            if (account !== null) {
                this.loadShoppingLists(account); 
            } else {
                // eslint-disable-next-line no-console
                console.log("condition non verifie");
            }
        });
    }

    loadShoppingLists(account: Account): void{
        
        this.myShoppingListService
            .queryByUserLogin(account.login)
            .subscribe((res: HttpResponse<IShoppingList[]>) => {
                this.shoppingLists = res.body ?? []
              });
    }

    trackId(index: number, item: IShoppingList): number {
        return item.id!;
      }
    

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }
}