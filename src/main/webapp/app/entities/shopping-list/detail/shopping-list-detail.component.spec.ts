import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShoppingListDetailComponent } from './shopping-list-detail.component';

describe('ShoppingList Management Detail Component', () => {
  let comp: ShoppingListDetailComponent;
  let fixture: ComponentFixture<ShoppingListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShoppingListDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shoppingList: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShoppingListDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShoppingListDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shoppingList on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shoppingList).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
