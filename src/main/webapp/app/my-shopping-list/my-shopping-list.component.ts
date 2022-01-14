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
    isLoading = false;
    user : User = {};
    account: Account | null = null;

    private readonly destroy$ = new Subject<void>();
    
    constructor(protected myShoppingListService: MyShoppingListService,
        private accountService: AccountService, ){
        this.shoppingLists = [];
    }
    ngOnInit(): void {
        this.isLoading = true;
        this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => {
            this.account = account;
            if (this.account !== null) {
                this.myShoppingListService
                .queryByUserLogin(this.account.login)
                .subscribe({
                next: (res: HttpResponse<IShoppingList[]>) => {
                    this.isLoading = false;
                    this.shoppingLists = res.body ?? [];
                },
                error: () => {
                    this.isLoading = false;
                },
                });
            }

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