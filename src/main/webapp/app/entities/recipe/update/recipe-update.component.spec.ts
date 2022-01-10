import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RecipeService } from '../service/recipe.service';
import { IRecipe, Recipe } from '../recipe.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';

import { RecipeUpdateComponent } from './recipe-update.component';

describe('Recipe Management Update Component', () => {
  let comp: RecipeUpdateComponent;
  let fixture: ComponentFixture<RecipeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recipeService: RecipeService;
  let userService: UserService;
  let ingredientService: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RecipeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(RecipeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecipeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recipeService = TestBed.inject(RecipeService);
    userService = TestBed.inject(UserService);
    ingredientService = TestBed.inject(IngredientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const recipe: IRecipe = { id: 456 };
      const user: IUser = { id: 22097 };
      recipe.user = user;

      const userCollection: IUser[] = [{ id: 40794 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ingredient query and add missing value', () => {
      const recipe: IRecipe = { id: 456 };
      const ingredient: IIngredient = { id: 10338 };
      recipe.ingredient = ingredient;

      const ingredientCollection: IIngredient[] = [{ id: 95004 }];
      jest.spyOn(ingredientService, 'query').mockReturnValue(of(new HttpResponse({ body: ingredientCollection })));
      const additionalIngredients = [ingredient];
      const expectedCollection: IIngredient[] = [...additionalIngredients, ...ingredientCollection];
      jest.spyOn(ingredientService, 'addIngredientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(ingredientService.query).toHaveBeenCalled();
      expect(ingredientService.addIngredientToCollectionIfMissing).toHaveBeenCalledWith(ingredientCollection, ...additionalIngredients);
      expect(comp.ingredientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const recipe: IRecipe = { id: 456 };
      const user: IUser = { id: 83719 };
      recipe.user = user;
      const ingredient: IIngredient = { id: 10221 };
      recipe.ingredient = ingredient;

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(recipe));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.ingredientsSharedCollection).toContain(ingredient);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Recipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipe }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalledWith(recipe);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Recipe>>();
      const recipe = new Recipe();
      jest.spyOn(recipeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipe }));
      saveSubject.complete();

      // THEN
      expect(recipeService.create).toHaveBeenCalledWith(recipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Recipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recipeService.update).toHaveBeenCalledWith(recipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackIngredientById', () => {
      it('Should return tracked Ingredient primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIngredientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
