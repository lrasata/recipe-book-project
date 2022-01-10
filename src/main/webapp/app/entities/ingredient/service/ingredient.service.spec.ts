import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIngredient, Ingredient } from '../ingredient.model';

import { IngredientService } from './ingredient.service';

describe('Ingredient Service', () => {
  let service: IngredientService;
  let httpMock: HttpTestingController;
  let elemDefault: IIngredient;
  let expectedResult: IIngredient | IIngredient[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IngredientService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      amount: 0,
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

    it('should create a Ingredient', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Ingredient()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ingredient', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          amount: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ingredient', () => {
      const patchObject = Object.assign(
        {
          amount: 1,
        },
        new Ingredient()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ingredient', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          amount: 1,
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

    it('should delete a Ingredient', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIngredientToCollectionIfMissing', () => {
      it('should add a Ingredient to an empty array', () => {
        const ingredient: IIngredient = { id: 123 };
        expectedResult = service.addIngredientToCollectionIfMissing([], ingredient);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ingredient);
      });

      it('should not add a Ingredient to an array that contains it', () => {
        const ingredient: IIngredient = { id: 123 };
        const ingredientCollection: IIngredient[] = [
          {
            ...ingredient,
          },
          { id: 456 },
        ];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, ingredient);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ingredient to an array that doesn't contain it", () => {
        const ingredient: IIngredient = { id: 123 };
        const ingredientCollection: IIngredient[] = [{ id: 456 }];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, ingredient);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ingredient);
      });

      it('should add only unique Ingredient to an array', () => {
        const ingredientArray: IIngredient[] = [{ id: 123 }, { id: 456 }, { id: 13757 }];
        const ingredientCollection: IIngredient[] = [{ id: 123 }];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, ...ingredientArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ingredient: IIngredient = { id: 123 };
        const ingredient2: IIngredient = { id: 456 };
        expectedResult = service.addIngredientToCollectionIfMissing([], ingredient, ingredient2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ingredient);
        expect(expectedResult).toContain(ingredient2);
      });

      it('should accept null and undefined values', () => {
        const ingredient: IIngredient = { id: 123 };
        expectedResult = service.addIngredientToCollectionIfMissing([], null, ingredient, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ingredient);
      });

      it('should return initial array if no Ingredient is added', () => {
        const ingredientCollection: IIngredient[] = [{ id: 123 }];
        expectedResult = service.addIngredientToCollectionIfMissing(ingredientCollection, undefined, null);
        expect(expectedResult).toEqual(ingredientCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
