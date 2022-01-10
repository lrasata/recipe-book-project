import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRecipe, Recipe } from '../recipe.model';

import { RecipeService } from './recipe.service';

describe('Recipe Service', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;
  let elemDefault: IRecipe;
  let expectedResult: IRecipe | IRecipe[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      description: 'AAAAAAA',
      imagePath: 'AAAAAAA',
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

    it('should create a Recipe', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Recipe()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Recipe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          imagePath: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Recipe', () => {
      const patchObject = Object.assign(
        {
          title: 'BBBBBB',
          description: 'BBBBBB',
          imagePath: 'BBBBBB',
        },
        new Recipe()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Recipe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          description: 'BBBBBB',
          imagePath: 'BBBBBB',
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

    it('should delete a Recipe', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRecipeToCollectionIfMissing', () => {
      it('should add a Recipe to an empty array', () => {
        const recipe: IRecipe = { id: 123 };
        expectedResult = service.addRecipeToCollectionIfMissing([], recipe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recipe);
      });

      it('should not add a Recipe to an array that contains it', () => {
        const recipe: IRecipe = { id: 123 };
        const recipeCollection: IRecipe[] = [
          {
            ...recipe,
          },
          { id: 456 },
        ];
        expectedResult = service.addRecipeToCollectionIfMissing(recipeCollection, recipe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Recipe to an array that doesn't contain it", () => {
        const recipe: IRecipe = { id: 123 };
        const recipeCollection: IRecipe[] = [{ id: 456 }];
        expectedResult = service.addRecipeToCollectionIfMissing(recipeCollection, recipe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recipe);
      });

      it('should add only unique Recipe to an array', () => {
        const recipeArray: IRecipe[] = [{ id: 123 }, { id: 456 }, { id: 58184 }];
        const recipeCollection: IRecipe[] = [{ id: 123 }];
        expectedResult = service.addRecipeToCollectionIfMissing(recipeCollection, ...recipeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const recipe: IRecipe = { id: 123 };
        const recipe2: IRecipe = { id: 456 };
        expectedResult = service.addRecipeToCollectionIfMissing([], recipe, recipe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(recipe);
        expect(expectedResult).toContain(recipe2);
      });

      it('should accept null and undefined values', () => {
        const recipe: IRecipe = { id: 123 };
        expectedResult = service.addRecipeToCollectionIfMissing([], null, recipe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(recipe);
      });

      it('should return initial array if no Recipe is added', () => {
        const recipeCollection: IRecipe[] = [{ id: 123 }];
        expectedResult = service.addRecipeToCollectionIfMissing(recipeCollection, undefined, null);
        expect(expectedResult).toEqual(recipeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
