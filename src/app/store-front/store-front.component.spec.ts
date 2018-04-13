import {
  async,
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { StoreFrontComponent } from './store-front.component';
import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/from';
import { asyncData } from '../testing/async-observable-helpers';
import { ShoppingCart } from '../models/shopping-cart.model';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { HttpClientModule } from '@angular/common/http';
import * as sinon from 'sinon';
import { DeliveryOptionsService } from '../services/delivery-options.service';
import {
  StorageService,
  LocalStorageService
} from '../services/storage.service';
import { CartItem } from '../models/cart-item.model';

const product1 = new Product();
product1.name = 'Product 1';
product1.id = '1';
product1.price = 1;
product1.description = 'Description 1';

const product2 = new Product();
product2.name = 'Product 2';
product2.id = '2';
product2.price = 1;
product2.description = 'Description 2';

class MockProductsService extends ProductsService {
  public all(): Observable<Product[]> {
    return Observable.from([[product1, product2]]);
  }
}

class MockShoppingCartService {
  public unsubsribeCalled = false;
  public emptyCalled = false;

  private subscriptionObservable: Observable<ShoppingCart>;
  private subscriber: Observer<ShoppingCart>;
  private cart: ShoppingCart = new ShoppingCart();

  public constructor() {
    this.subscriptionObservable = new Observable<ShoppingCart>(
      (observer: Observer<ShoppingCart>) => {
        this.subscriber = observer;
        observer.next(this.cart);
        return () => (this.unsubsribeCalled = true);
      }
    );
  }
  public addItem(product: Product, quantity: number): void {}
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

describe('StoreFrontComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ShoppingCartComponent, StoreFrontComponent],
        imports: [HttpClientModule],
        providers: [
          { provide: ProductsService, useClass: MockProductsService },
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
    'Should create the component',
    async(() => {
      const fixture = TestBed.createComponent(StoreFrontComponent);
      const component = fixture.debugElement.componentInstance;
      expect(component).toBeTruthy();
    })
  );

  it(
    'should display all the products',
    async(() => {
      const fixture = TestBed.createComponent(StoreFrontComponent);
      fixture.detectChanges();

      const component = fixture.debugElement.componentInstance;
      const compiled = fixture.debugElement.nativeElement;
      const productElements = compiled.querySelectorAll('.product-container');
      expect(productElements.length).toEqual(2);

      expect(
        productElements[0].querySelector('.js-product-name').textContent
      ).toEqual(product1.name);
      expect(
        productElements[0].querySelector('.js-product-price').textContent
      ).toContain(product1.price);
      expect(
        productElements[0].querySelector('.js-product-desc').textContent
      ).toContain(product1.description);

      expect(
        productElements[1].querySelector('.js-product-name').textContent
      ).toEqual(product2.name);
      expect(
        productElements[1].querySelector('.js-product-price').textContent
      ).toContain(product2.price);
      expect(
        productElements[1].querySelector('.js-product-desc').textContent
      ).toContain(product2.description);
    })
  );

  it(
    'should not display the remove item button when the item is not in the cart',
    async(() => {
      const fixture = TestBed.createComponent(StoreFrontComponent);
      fixture.detectChanges();

      const component = fixture.debugElement.componentInstance;
      const compiled = fixture.debugElement.nativeElement;

      const prodElems = compiled.querySelectorAll('.product-container');
      expect(prodElems.length).toEqual(2);

      expect(prodElems[0].querySelectorAll('.js-btn-remove').length).toEqual(0);
    })
  );

  it(
    'should add the product to the cart when add item button is clicked',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const fixture = TestBed.createComponent(StoreFrontComponent);
        fixture.detectChanges();

        const addItemSpy = sinon.spy(service, 'addItem');

        const component = fixture.debugElement.componentInstance;
        const compiled = fixture.debugElement.nativeElement;

        const prodElems = compiled.querySelectorAll('.product-container');

        prodElems[0].querySelector('.js-btn-add').click();
        sinon.assert.calledOnce(addItemSpy);
        sinon.assert.calledWithExactly(addItemSpy, product1, 1);
      })
    )
  );

  it(
    'should remove the product from the cart when remove item button is clicked',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const newCart = new ShoppingCart();
        const cartItem = new CartItem();
        cartItem.productId = product1.id;
        cartItem.quantity = 1;
        newCart.grossTotal = 1.5;
        newCart.items = [cartItem];
        service.dispatchCart(newCart);
        const fixture = TestBed.createComponent(StoreFrontComponent);
        fixture.detectChanges();

        const addItemSpy = sinon.spy(service, 'addItem');

        const component = fixture.debugElement.componentInstance;
        const compiled = fixture.debugElement.nativeElement;
        const prodElems = compiled.querySelectorAll('.product-container');

        prodElems[0].querySelector('.js-btn-remove').click();
        sinon.assert.calledOnce(addItemSpy);
        sinon.assert.calledWithExactly(addItemSpy, product1, -1);
      })
    )
  );
});

describe('StoreFrontComponent', () => {
  const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
  const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
    ''
  ]);
  @Component({ selector: 'app-shopping-cart', template: '' })
  class AppShoppingCartComponent {}

  let component: StoreFrontComponent;
  let fixture: ComponentFixture<StoreFrontComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [StoreFrontComponent, AppShoppingCartComponent],
        providers: [
          { provide: ShoppingCartService, useValue: shoppingCartServiceSpy },
          { provide: ProductsService, useValue: productsServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
