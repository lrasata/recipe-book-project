import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IShoppingList, ShoppingList } from '../shopping-list.model';
import { ShoppingListService } from '../service/shopping-list.service';

import { ShoppingListRoutingResolveService } from './shopping-list-routing-resolve.service';

describe('ShoppingList routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ShoppingListRoutingResolveService;
  let service: ShoppingListService;
  let resultShoppingList: IShoppingList | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ShoppingListRoutingResolveService);
    service = TestBed.inject(ShoppingListService);
    resultShoppingList = undefined;
  });

  describe('resolve', () => {
    it('should return IShoppingList returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShoppingList = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultShoppingList).toEqual({ id: 123 });
    });

    it('should return new IShoppingList if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShoppingList = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultShoppingList).toEqual(new ShoppingList());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ShoppingList })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultShoppingList = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultShoppingList).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
