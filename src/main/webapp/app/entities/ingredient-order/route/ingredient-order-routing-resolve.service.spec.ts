import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IIngredientOrder, IngredientOrder } from '../ingredient-order.model';
import { IngredientOrderService } from '../service/ingredient-order.service';

import { IngredientOrderRoutingResolveService } from './ingredient-order-routing-resolve.service';

describe('IngredientOrder routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: IngredientOrderRoutingResolveService;
  let service: IngredientOrderService;
  let resultIngredientOrder: IIngredientOrder | undefined;

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
    routingResolveService = TestBed.inject(IngredientOrderRoutingResolveService);
    service = TestBed.inject(IngredientOrderService);
    resultIngredientOrder = undefined;
  });

  describe('resolve', () => {
    it('should return IIngredientOrder returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIngredientOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIngredientOrder).toEqual({ id: 123 });
    });

    it('should return new IIngredientOrder if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIngredientOrder = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultIngredientOrder).toEqual(new IngredientOrder());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as IngredientOrder })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultIngredientOrder = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultIngredientOrder).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
