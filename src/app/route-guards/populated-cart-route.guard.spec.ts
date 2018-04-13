import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { PopulatedCartRouteGuard } from './populated-cart-route.guard';
import { Router, RouterModule } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as sinon from 'sinon';
import { CartItem } from '../models/cart-item.model';

describe('PopulatedCartRouteGuard', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
    ''
  ]);
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

class MockShoppingCartService {
  public unsubscribeCalled = false;
  private subscriptionObservable: Observable<ShoppingCart>;
  private subscriber: Observer<ShoppingCart>;
  private cart: ShoppingCart = new ShoppingCart();

  public constructor() {
    this.subscriptionObservable = new Observable<ShoppingCart>(
      (observer: Observer<ShoppingCart>) => {
        this.subscriber = observer;
        observer.next(this.cart);
        return () => (this.unsubscribeCalled = true);
      }
    );
  }

  public get(): Observable<ShoppingCart> {
    return this.subscriptionObservable;
  }

  public dispatchCart(cart: ShoppingCart): void {
    this.cart = cart;
    if (this.subscriber) {
      this.subscriber.next(cart);
    }
  }
}

describe('PopulatedCartRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [
        PopulatedCartRouteGuard,
        { provide: ShoppingCartService, useClass: MockShoppingCartService },
        { provide: Router, useValue: sinon.createStubInstance(Router) }
      ]
    });
  });

  it(
    'should be injectable',
    inject([PopulatedCartRouteGuard], (routeGuard: PopulatedCartRouteGuard) => {
      expect(routeGuard).toBeTruthy();
    })
  );

  describe('canActivate', () => {
    it(
      'should return true if there are items in the cart',
      inject(
        [Router, ShoppingCartService, PopulatedCartRouteGuard],
        (
          router: Router,
          shoppingCartService: MockShoppingCartService,
          grd: PopulatedCartRouteGuard
        ) => {
          // code
          const newCart = new ShoppingCart();
          const cartItem = new CartItem();
          cartItem.quantity = 1;
          newCart.items = [cartItem];
          shoppingCartService.dispatchCart(newCart);
          let x = grd.canActivate(null, null) as Observable<boolean>;

          x.subscribe(result => expect(result).toBeTruthy());
        }
      )
    );

    it(
      'should return false and redirect to "/" if there are no items in the cart',
      inject(
        [Router, PopulatedCartRouteGuard],
        (router: Router, grd: PopulatedCartRouteGuard) => {
          let x = grd.canActivate(null, null) as Observable<boolean>;
          x.subscribe(result => expect(result).toBeFalsy());

          sinon.assert.calledOnce(router.navigate as sinon.SinonSpy);
          sinon.assert.calledWithExactly(router.navigate as sinon.SinonSpy, [
            '/'
          ]);
        }
      )
    );
  });
});
