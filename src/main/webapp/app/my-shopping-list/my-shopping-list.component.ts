import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { User } from "app/admin/user-management/user-management.model";
import { Account } from "app/core/auth/account.model";
import { AccountService } from "app/core/auth/account.service";
import { ShoppingStatus } from "app/entities/enumerations/shopping-status.model";
import { ShoppingListDeleteDialogComponent } from "app/entities/shopping-list/delete/shopping-list-delete-dialog.component";
import { IShoppingList, ShoppingList } from "app/entities/shopping-list/shopping-list.model";
import { finalize, Observable, Subject, takeUntil } from "rxjs";
import { MyShoppingListService } from "./my-shopping-list.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-myshoppinglist',
    templateUrl: './my-shopping-list.component.html'
  })
export class MyShoppingListComponent implements OnInit, OnDestroy {
    shoppingDraftLists: IShoppingList[] =  [];
    shoppingOrderedLists: IShoppingList[] =  [];
    user : User = {};
    account: Account | null = null;

    private readonly destroy$ = new Subject<void>();
    
    constructor(protected myShoppingListService: MyShoppingListService,
        private accountService: AccountService,
        protected modalService: NgbModal,){
        this.shoppingDraftLists = [];
    }
    ngOnInit(): void {
        this.accountService
        .getAuthenticationState()
        .pipe(takeUntil(this.destroy$))
        .subscribe(account => {
            this.account =  account;
            if (account !== null) {
                this.loadDraftShoppingLists(account); 
                this.loadOrderedShoppingLists(account); 
            }
        });
    }

    loadDraftShoppingLists(account: Account): void{
        this.myShoppingListService
            .queryByStatusAndUserLogin(account.login, ShoppingStatus.DRAFT)
            .subscribe((res: HttpResponse<IShoppingList[]>) => {
                this.shoppingDraftLists = res.body ?? []
              });
    }

    loadOrderedShoppingLists(account: Account): void{
        this.myShoppingListService
            .queryByStatusAndUserLogin(account.login, ShoppingStatus.ORDERED)
            .subscribe((res: HttpResponse<IShoppingList[]>) => {
                this.shoppingOrderedLists = res.body ?? []
              });
    }

    order(shoppingList: ShoppingList): void {
        this.subscribeToSaveResponse(this.myShoppingListService.order(shoppingList));
    }


    trackId(index: number, item: IShoppingList): number {
        return item.id!;
      }
    
    delete(shoppingList: IShoppingList): void {
        const modalRef = this.modalService.open(ShoppingListDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.shoppingList = shoppingList;
        // unsubscribe not needed because closed completes on modal close
        modalRef.closed.subscribe(reason => {
          if (reason === 'deleted') {
            this.reset();
          }
        });
    }
    
    reset(): void {
        if (this.account !== null) {
            this.loadDraftShoppingLists(this.account); 
            this.loadOrderedShoppingLists(this.account); 
        }
      }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

      protected subscribeToSaveResponse(result: Observable<HttpResponse<IShoppingList>>): void {
        result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
          next: () => this.onSaveSuccess(),
          error: () => this.onSaveError(),
        });
      }
    
      protected onSaveSuccess(): void {
        this.reset();
      }
    
      protected onSaveError(): void {
        // Api for inheritance.
      }
    
      protected onSaveFinalize(): void {
          // Api for inheritance.
      }
}