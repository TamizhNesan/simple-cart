import {
  async,
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { ShoppingCartComponent } from './shopping-cart.component';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Product } from '../models/product.model';
import { asyncData } from '../testing/async-observable-helpers';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as sinon from 'sinon';
import { DeliveryOptionsService } from '../services/delivery-options.service';
import {
  StorageService,
  LocalStorageService
} from '../services/storage.service';
import { Mock } from 'protractor/built/driverProviders';
import { CartItem } from '../models/cart-item.model';

describe('ShoppingCartComponent', () => {
  const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
  const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
    'get'
  ]);

  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  beforeEach(
    async(() => {
      const testProducts: Product[] = [];
      const cart = new ShoppingCart();
      cart.grossTotal = 0;
      shoppingCartServiceSpy.get.and.returnValue(asyncData(cart));
      productsServiceSpy.all.and.returnValue(asyncData(testProducts));
      TestBed.configureTestingModule({
        declarations: [ShoppingCartComponent],
        providers: [
          { provide: ShoppingCartService, useValue: shoppingCartServiceSpy },
          { provide: ProductsService, useValue: productsServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockShoppingCartService {
  public unsubscribeCalled = false;
  public emptyCalled = false;

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

  public empty(): void {
    this.emptyCalled = true;
  }

  public dispatchCart(cart: ShoppingCart): void {
    this.cart = cart;
    if (this.subscriber) {
      this.subscriber.next(cart);
    }
  }
}

describe('ShoppingCartComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ShoppingCartComponent],
        providers: [
          {
            provide: ProductsService,
            useValue: sinon.createStubInstance(ProductsService)
          },
          {
            provide: DeliveryOptionsService,
            useValue: sinon.createStubInstance(DeliveryOptionsService)
          },
          { provide: StorageService, useClass: LocalStorageService },
          { provide: ShoppingCartService, useClass: MockShoppingCartService }
        ]
      }).compileComponents();
    })
  );

  it(
    'should create the component',
    async(() => {
      const fixture = TestBed.createComponent(ShoppingCartComponent);
      const component = fixture.debugElement.componentInstance;
      expect(component).toBeTruthy();
    })
  );
  it(
    'should render gross total of shopping car',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const fixture = TestBed.createComponent(ShoppingCartComponent);
        fixture.detectChanges();

        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.js-cart-total').textContent).toContain(
          '$0.00'
        );

        const newCart = new ShoppingCart();
        newCart.grossTotal = 1.5;
        service.dispatchCart(newCart);
        fixture.detectChanges();

        expect(compiled.querySelector('.js-cart-total').textContent).toContain(
          '$1.50'
        );
      })
    )
  );

  it(
    'should empty the cart when empty shopping cart button pressed',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const newCart = new ShoppingCart();
        const cartItem = new CartItem();
        cartItem.quantity = 1;
        newCart.grossTotal = 1.5;
        newCart.items = [cartItem];
        service.dispatchCart(newCart);
        const fixture = TestBed.createComponent(ShoppingCartComponent);
        fixture.detectChanges();
        fixture.debugElement.nativeElement
          .querySelector('.js-btn-empty-cart')
          .click();
        expect(service.emptyCalled).toBeTruthy();
      })
    )
  );
});
