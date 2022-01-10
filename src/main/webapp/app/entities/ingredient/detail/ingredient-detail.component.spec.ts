import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IngredientDetailComponent } from './ingredient-detail.component';

describe('Ingredient Management Detail Component', () => {
  let comp: IngredientDetailComponent;
  let fixture: ComponentFixture<IngredientDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ingredient: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IngredientDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IngredientDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ingredient on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ingredient).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
