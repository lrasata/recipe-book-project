import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IngredientOrderDetailComponent } from './ingredient-order-detail.component';

describe('IngredientOrder Management Detail Component', () => {
  let comp: IngredientOrderDetailComponent;
  let fixture: ComponentFixture<IngredientOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientOrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ingredientOrder: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IngredientOrderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IngredientOrderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ingredientOrder on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ingredientOrder).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
