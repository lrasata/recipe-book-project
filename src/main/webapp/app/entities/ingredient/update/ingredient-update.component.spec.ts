import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IngredientService } from '../service/ingredient.service';
import { IIngredient, Ingredient } from '../ingredient.model';

import { IngredientUpdateComponent } from './ingredient-update.component';

describe('Ingredient Management Update Component', () => {
  let comp: IngredientUpdateComponent;
  let fixture: ComponentFixture<IngredientUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ingredientService: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IngredientUpdateComponent],
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
      .overrideTemplate(IngredientUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IngredientUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ingredientService = TestBed.inject(IngredientService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const ingredient: IIngredient = { id: 456 };

      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ingredient));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ingredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalledWith(ingredient);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ingredient>>();
      const ingredient = new Ingredient();
      jest.spyOn(ingredientService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ingredient }));
      saveSubject.complete();

      // THEN
      expect(ingredientService.create).toHaveBeenCalledWith(ingredient);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ingredient>>();
      const ingredient = { id: 123 };
      jest.spyOn(ingredientService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ingredient });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ingredientService.update).toHaveBeenCalledWith(ingredient);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
