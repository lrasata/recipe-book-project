import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShoppingListService } from '../service/shopping-list.service';
import { IShoppingList, ShoppingList } from '../shopping-list.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';

import { ShoppingListUpdateComponent } from './shopping-list-update.component';

describe('ShoppingList Management Update Component', () => {
  let comp: ShoppingListUpdateComponent;
  let fixture: ComponentFixture<ShoppingListUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shoppingListService: ShoppingListService;
  let userService: UserService;
  let ingredientService: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShoppingListUpdateComponent],
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
      .overrideTemplate(ShoppingListUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShoppingListUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shoppingListService = TestBed.inject(ShoppingListService);
    userService = TestBed.inject(UserService);
    ingredientService = TestBed.inject(IngredientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const shoppingList: IShoppingList = { id: 456 };
      const user: IUser = { id: 8446 };
      shoppingList.user = user;

      const userCollection: IUser[] = [{ id: 80809 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shoppingList });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Ingredient query and add missing value', () => {
      const shoppingList: IShoppingList = { id: 456 };
      const ingredients: IIngredient[] = [{ id: 9005 }];
      shoppingList.ingredients = ingredients;

      const ingredientCollection: IIngredient[] = [{ id: 2068 }];
      jest.spyOn(ingredientService, 'query').mockReturnValue(of(new HttpResponse({ body: ingredientCollection })));
      const additionalIngredients = [...ingredients];
      const expectedCollection: IIngredient[] = [...additionalIngredients, ...ingredientCollection];
      jest.spyOn(ingredientService, 'addIngredientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shoppingList });
      comp.ngOnInit();

      expect(ingredientService.query).toHaveBeenCalled();
      expect(ingredientService.addIngredientToCollectionIfMissing).toHaveBeenCalledWith(ingredientCollection, ...additionalIngredients);
      expect(comp.ingredientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shoppingList: IShoppingList = { id: 456 };
      const user: IUser = { id: 67201 };
      shoppingList.user = user;
      const ingredients: IIngredient = { id: 11469 };
      shoppingList.ingredients = [ingredients];

      activatedRoute.data = of({ shoppingList });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(shoppingList));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.ingredientsSharedCollection).toContain(ingredients);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShoppingList>>();
      const shoppingList = { id: 123 };
      jest.spyOn(shoppingListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shoppingList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shoppingList }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shoppingListService.update).toHaveBeenCalledWith(shoppingList);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShoppingList>>();
      const shoppingList = new ShoppingList();
      jest.spyOn(shoppingListService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shoppingList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shoppingList }));
      saveSubject.complete();

      // THEN
      expect(shoppingListService.create).toHaveBeenCalledWith(shoppingList);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ShoppingList>>();
      const shoppingList = { id: 123 };
      jest.spyOn(shoppingListService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shoppingList });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shoppingListService.update).toHaveBeenCalledWith(shoppingList);
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

  describe('Getting selected relationships', () => {
    describe('getSelectedIngredient', () => {
      it('Should return option if no Ingredient is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedIngredient(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Ingredient for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedIngredient(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Ingredient is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedIngredient(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
