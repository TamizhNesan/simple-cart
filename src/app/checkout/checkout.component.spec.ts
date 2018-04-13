import {
  async,
  inject,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { DeliveryOptionsService } from '../services/delivery-options.service';
import { Product } from '../models/product.model';
import { asyncData } from '../testing/async-observable-helpers';
import { DeliveryOption } from '../models/delivery-option.model';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Observable } from 'rxjs/Observable';
import { HttpClientModule } from '@angular/common/http';
import {
  StorageService,
  LocalStorageService
} from '../services/storage.service';
import { CartItem } from '../models/cart-item.model';
import { Observer } from 'rxjs/Observer';
import { del } from 'selenium-webdriver/http';

describe('CheckoutComponent', () => {
  const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
  const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
    'get'
  ]);
  const deliveryOptionsServiceSpy = jasmine.createSpyObj(
    'DeliveryOptionsService',
    ['all']
  );
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(
    async(() => {
      const testProducts: Product[] = [];
      const fakeDeliveryOptions: DeliveryOption[] = [];
      productsServiceSpy.all.and.returnValue(asyncData(testProducts));
      deliveryOptionsServiceSpy.all.and.returnValue(
        asyncData(fakeDeliveryOptions)
      );
      const cart = new ShoppingCart();
      cart.grossTotal = 0;
      shoppingCartServiceSpy.get.and.returnValue(asyncData(cart));
      TestBed.configureTestingModule({
        declarations: [CheckoutComponent],
        providers: [
          { provide: ShoppingCartService, useValue: shoppingCartServiceSpy },
          { provide: ProductsService, useValue: productsServiceSpy },
          {
            provide: DeliveryOptionsService,
            useValue: deliveryOptionsServiceSpy
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

///////////////////
const PRODUCT_1 = new Product();
PRODUCT_1.name = 'Product 1';
PRODUCT_1.id = '1';
PRODUCT_1.price = 1;
PRODUCT_1.description = 'desc1';

const PRODUCT_2 = new Product();
PRODUCT_2.name = 'Product 2';
PRODUCT_2.id = '2';
PRODUCT_2.price = 2;
PRODUCT_2.description = 'desc2';

const DELIVERY_OPT_1 = new DeliveryOption();
DELIVERY_OPT_1.name = 'Delivery Option 1';
DELIVERY_OPT_1.id = '1';
DELIVERY_OPT_1.price = 1;

const DELIVERY_OPT_2 = new DeliveryOption();
DELIVERY_OPT_2.name = 'Delivery Option 2';
DELIVERY_OPT_2.id = '2';
DELIVERY_OPT_2.price = 2;

class MockProductsService extends ProductsService {
  public all(): Observable<Product[]> {
    return Observable.from([[PRODUCT_1, PRODUCT_2]]);
  }
}

class MockDeliveryOptionsService extends DeliveryOptionsService {
  public all(): Observable<DeliveryOption[]> {
    return Observable.from([[DELIVERY_OPT_1, DELIVERY_OPT_2]]);
  }
}

class MockShoppingCartService {
  public unsubscribeCalled = false;
  public emptyCalled = false;
  private cart: ShoppingCart = new ShoppingCart();
  private subscriber: Observer<ShoppingCart>;
  private subscriptionObservable: Observable<ShoppingCart>;
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

describe('CheckoutComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CheckoutComponent],
        imports: [HttpClientModule],
        providers: [
          { provide: ProductsService, useClass: MockProductsService },
          {
            provide: DeliveryOptionsService,
            useClass: MockDeliveryOptionsService
          },
          { provide: StorageService, useClass: LocalStorageService },
          { provide: ShoppingCartService, useClass: MockShoppingCartService }
        ]
      }).compileComponents();
    })
  );

  it(
    'should craate the component',
    async(() => {
      const fixture = TestBed.createComponent(CheckoutComponent);
      const component = fixture.debugElement.componentInstance;
      expect(component).toBeTruthy();
    })
  );

  it(
    'should display all the products in the cart',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const newCart = new ShoppingCart();
        const cartItem = new CartItem();
        cartItem.productId = PRODUCT_1.id;
        cartItem.quantity = 2;
        newCart.grossTotal = 3;
        newCart.items = [cartItem];
        service.dispatchCart(newCart);
        const fixture = TestBed.createComponent(CheckoutComponent);
        fixture.detectChanges();

        const component = fixture.debugElement.componentInstance;
        const compiled = fixture.debugElement.nativeElement;
        const prodElems = compiled.querySelectorAll('.checkout_row');

        expect(prodElems.length).toEqual(1);
        expect(
          prodElems[0].querySelector('.js-product-name').textContent.trim()
        ).toEqual(PRODUCT_1.name);
        expect(
          prodElems[0].querySelector('.js-product-desc').textContent
        ).toContain(PRODUCT_1.description);
        expect(
          prodElems[0].querySelector('.js-product-costs').textContent
        ).toContain(`${cartItem.quantity} x $${PRODUCT_1.price}`);
        expect(
          prodElems[0].querySelector('.js-product-total').textContent
        ).toContain(PRODUCT_1.price * cartItem.quantity);
      })
    )
  );

  it(
    'should display all the delivery options',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const fixture = TestBed.createComponent(CheckoutComponent);
        fixture.detectChanges();

        const component = fixture.debugElement.componentInstance;
        const compiled = fixture.debugElement.nativeElement;
        const deliveryOptions = compiled.querySelectorAll('.delivery-option');

        expect(deliveryOptions.length).toEqual(2);
        expect(
          deliveryOptions[0].querySelector('.js-option-name').textContent.trim()
        ).toEqual(DELIVERY_OPT_1.name);
        expect(
          deliveryOptions[0].querySelector('.js-option-price').textContent
        ).toContain(DELIVERY_OPT_1.price);
        expect(
          deliveryOptions[1].querySelector('.js-option-name').textContent.trim()
        ).toEqual(DELIVERY_OPT_2.name);
        expect(
          deliveryOptions[1].querySelector('.js-option-price').textContent
        ).toContain(DELIVERY_OPT_2.price);
      })
    )
  );
});
