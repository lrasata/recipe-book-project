import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IRecipe, Recipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';
import { HttpResponse } from '@angular/common/http';
import { HomeService } from './home.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  recipes: IRecipe[];
  itemsPerPage = 6;
  recipeDetailToDisplay : Recipe = {};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService, 
    private router: Router, 
    private recipeService: RecipeService,
    private homeService: HomeService) {
      this.recipes = [];
    }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));

    this.recipeService
      .query({
        size: this.itemsPerPage,
      })
      .subscribe((res: HttpResponse<IRecipe[]>) => (this.recipes = res.body ?? []));
    
    this.homeService.recipeSelected
      .subscribe(
        (recipe: Recipe) => {
          this.recipeDetailToDisplay = recipe;
        }
      );
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
