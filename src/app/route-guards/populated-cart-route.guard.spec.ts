import { TestBed, async, inject } from '@angular/core/testing';

import { PopulatedCartRouteGuard } from './populated-cart-route.guard';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';
const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
  ''
]);
describe('PopulatedCartRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PopulatedCartRouteGuard,
        { provide: Router, useValue: routerSpy },
        { provide: ShoppingCartService, useValue: shoppingCartServiceSpy }
      ]
    });
  });

  it(
    'should ...',
    inject([PopulatedCartRouteGuard], (guard: PopulatedCartRouteGuard) => {
      expect(guard).toBeTruthy();
    })
  );
});
