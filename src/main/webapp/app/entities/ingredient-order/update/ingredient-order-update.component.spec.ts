import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IngredientOrderService } from '../service/ingredient-order.service';
import { IIngredientOrder, IngredientOrder } from '../ingredient-order.model';
import { IIngredient } from 'app/entities/ingredient/ingredient.model';
import { IngredientService } from 'app/entities/ingredient/service/ingredient.service';
import { IShoppingList } from 'app/entities/shopping-list/shopping-list.model';
import { ShoppingListService } from 'app/entities/shopping-list/service/shopping-list.service';

import { IngredientOrderUpdateComponent } from './ingredient-order-update.component';

describe('IngredientOrder Management Update Component', () => {
  let comp: IngredientOrderUpdateComponent;
  let fixture: ComponentFixture<IngredientOrderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ingredientOrderService: IngredientOrderService;
  let ingredientService: IngredientService;
  let shoppingListService: ShoppingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IngredientOrderUpdateComponent],
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
      .overrideTemplate(IngredientOrderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IngredientOrderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ingredientOrderService = TestBed.inject(IngredientOrderService);
    ingredientService = TestBed.inject(IngredientService);
    shoppingListService = TestBed.inject(ShoppingListService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Ingredient query and add missing value', () => {
      const ingredientOrder: IIngredientOrder = { id: 456 };
      const ingredient: IIngredient = { id: 77710 };
      ingredientOrder.ingredient = ingredient;

      const ingredientCollection: IIngredient[] = [{ id: 99471 }];
      jest.spyOn(ingredientService, 'query').mockReturnValue(of(new HttpResponse({ body: ingredientCollection })));
      const additionalIngredients = [ingredient];
      const expectedCollection: IIngredient[] = [...additionalIngredients, ...ingredientCollection];
      jest.spyOn(ingredientService, 'addIngredientToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ingredientOrder });
      comp.ngOnInit();

      expect(ingredientService.query).toHaveBeenCalled();
      expect(ingredientService.addIngredientToCollectionIfMissing).toHaveBeenCalledWith(ingredientCollection, ...additionalIngredients);
      expect(comp.ingredientsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ShoppingList query and add missing value', () => {
      const ingredientOrder: IIngredientOrder = { id: 456 };
      const shoppingList: IShoppingList = { id: 93866 };
      ingredientOrder.shoppingList = shoppingList;

      const shoppingListCollection: IShoppingList[] = [{ id: 2358 }];
      jest.spyOn(shoppingListService, 'query').mockReturnValue(of(new HttpResponse({ body: shoppingListCollection })));
      const additionalShoppingLists = [shoppingList];
      const expectedCollection: IShoppingList[] = [...additionalShoppingLists, ...shoppingListCollection];
      jest.spyOn(shoppingListService, 'addShoppingListToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ingredientOrder });
      comp.ngOnInit();

      expect(shoppingListService.query).toHaveBeenCalled();
      expect(shoppingListService.addShoppingListToCollectionIfMissing).toHaveBeenCalledWith(
        shoppingListCollection,
        ...additionalShoppingLists
      );
      expect(comp.shoppingListsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ingredientOrder: IIngredientOrder = { id: 456 };
      const ingredient: IIngredient = { id: 38637 };
      ingredientOrder.ingredient = ingredient;
      const shoppingList: IShoppingList = { id: 83760 };
      ingredientOrder.shoppingList = shoppingList;

      activatedRoute.data = of({ ingredientOrder });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ingredientOrder));
      expect(comp.ingredientsSharedCollection).toContain(ingredient);
      expect(comp.shoppingListsSharedCollection).toContain(shoppingList);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IngredientOrder>>();
      const ingredientOrder = { id: 123 };
      jest.spyOn(ingredientOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredientOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredientOrder }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ingredientOrderService.update).toHaveBeenCalledWith(ingredientOrder);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IngredientOrder>>();
      const ingredientOrder = new IngredientOrder();
      jest.spyOn(ingredientOrderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredientOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredientOrder }));
      saveSubject.complete();

      // THEN
      expect(ingredientOrderService.create).toHaveBeenCalledWith(ingredientOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IngredientOrder>>();
      const ingredientOrder = { id: 123 };
      jest.spyOn(ingredientOrderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredientOrder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ingredientOrderService.update).toHaveBeenCalledWith(ingredientOrder);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackIngredientById', () => {
      it('Should return tracked Ingredient primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIngredientById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackShoppingListById', () => {
      it('Should return tracked ShoppingList primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackShoppingListById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
