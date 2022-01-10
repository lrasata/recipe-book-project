import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShoppingList, ShoppingList } from '../shopping-list.model';

import { ShoppingListService } from './shopping-list.service';

describe('ShoppingList Service', () => {
  let service: ShoppingListService;
  let httpMock: HttpTestingController;
  let elemDefault: IShoppingList;
  let expectedResult: IShoppingList | IShoppingList[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShoppingListService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a ShoppingList', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ShoppingList()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ShoppingList', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ShoppingList', () => {
      const patchObject = Object.assign({}, new ShoppingList());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ShoppingList', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a ShoppingList', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShoppingListToCollectionIfMissing', () => {
      it('should add a ShoppingList to an empty array', () => {
        const shoppingList: IShoppingList = { id: 123 };
        expectedResult = service.addShoppingListToCollectionIfMissing([], shoppingList);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shoppingList);
      });

      it('should not add a ShoppingList to an array that contains it', () => {
        const shoppingList: IShoppingList = { id: 123 };
        const shoppingListCollection: IShoppingList[] = [
          {
            ...shoppingList,
          },
          { id: 456 },
        ];
        expectedResult = service.addShoppingListToCollectionIfMissing(shoppingListCollection, shoppingList);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ShoppingList to an array that doesn't contain it", () => {
        const shoppingList: IShoppingList = { id: 123 };
        const shoppingListCollection: IShoppingList[] = [{ id: 456 }];
        expectedResult = service.addShoppingListToCollectionIfMissing(shoppingListCollection, shoppingList);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shoppingList);
      });

      it('should add only unique ShoppingList to an array', () => {
        const shoppingListArray: IShoppingList[] = [{ id: 123 }, { id: 456 }, { id: 20043 }];
        const shoppingListCollection: IShoppingList[] = [{ id: 123 }];
        expectedResult = service.addShoppingListToCollectionIfMissing(shoppingListCollection, ...shoppingListArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shoppingList: IShoppingList = { id: 123 };
        const shoppingList2: IShoppingList = { id: 456 };
        expectedResult = service.addShoppingListToCollectionIfMissing([], shoppingList, shoppingList2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shoppingList);
        expect(expectedResult).toContain(shoppingList2);
      });

      it('should accept null and undefined values', () => {
        const shoppingList: IShoppingList = { id: 123 };
        expectedResult = service.addShoppingListToCollectionIfMissing([], null, shoppingList, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shoppingList);
      });

      it('should return initial array if no ShoppingList is added', () => {
        const shoppingListCollection: IShoppingList[] = [{ id: 123 }];
        expectedResult = service.addShoppingListToCollectionIfMissing(shoppingListCollection, undefined, null);
        expect(expectedResult).toEqual(shoppingListCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
