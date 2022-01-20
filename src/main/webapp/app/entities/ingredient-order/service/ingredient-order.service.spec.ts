import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIngredientOrder, IngredientOrder } from '../ingredient-order.model';

import { IngredientOrderService } from './ingredient-order.service';

describe('IngredientOrder Service', () => {
  let service: IngredientOrderService;
  let httpMock: HttpTestingController;
  let elemDefault: IIngredientOrder;
  let expectedResult: IIngredientOrder | IIngredientOrder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IngredientOrderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      amountOrder: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a IngredientOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new IngredientOrder()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a IngredientOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amountOrder: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a IngredientOrder', () => {
      const patchObject = Object.assign(
        {
          amountOrder: 1,
        },
        new IngredientOrder()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of IngredientOrder', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          amountOrder: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a IngredientOrder', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIngredientOrderToCollectionIfMissing', () => {
      it('should add a IngredientOrder to an empty array', () => {
        const ingredientOrder: IIngredientOrder = { id: 123 };
        expectedResult = service.addIngredientOrderToCollectionIfMissing([], ingredientOrder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ingredientOrder);
      });

      it('should not add a IngredientOrder to an array that contains it', () => {
        const ingredientOrder: IIngredientOrder = { id: 123 };
        const ingredientOrderCollection: IIngredientOrder[] = [
          {
            ...ingredientOrder,
          },
          { id: 456 },
        ];
        expectedResult = service.addIngredientOrderToCollectionIfMissing(ingredientOrderCollection, ingredientOrder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a IngredientOrder to an array that doesn't contain it", () => {
        const ingredientOrder: IIngredientOrder = { id: 123 };
        const ingredientOrderCollection: IIngredientOrder[] = [{ id: 456 }];
        expectedResult = service.addIngredientOrderToCollectionIfMissing(ingredientOrderCollection, ingredientOrder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ingredientOrder);
      });

      it('should add only unique IngredientOrder to an array', () => {
        const ingredientOrderArray: IIngredientOrder[] = [{ id: 123 }, { id: 456 }, { id: 2617 }];
        const ingredientOrderCollection: IIngredientOrder[] = [{ id: 123 }];
        expectedResult = service.addIngredientOrderToCollectionIfMissing(ingredientOrderCollection, ...ingredientOrderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ingredientOrder: IIngredientOrder = { id: 123 };
        const ingredientOrder2: IIngredientOrder = { id: 456 };
        expectedResult = service.addIngredientOrderToCollectionIfMissing([], ingredientOrder, ingredientOrder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ingredientOrder);
        expect(expectedResult).toContain(ingredientOrder2);
      });

      it('should accept null and undefined values', () => {
        const ingredientOrder: IIngredientOrder = { id: 123 };
        expectedResult = service.addIngredientOrderToCollectionIfMissing([], null, ingredientOrder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ingredientOrder);
      });

      it('should return initial array if no IngredientOrder is added', () => {
        const ingredientOrderCollection: IIngredientOrder[] = [{ id: 123 }];
        expectedResult = service.addIngredientOrderToCollectionIfMissing(ingredientOrderCollection, undefined, null);
        expect(expectedResult).toEqual(ingredientOrderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
