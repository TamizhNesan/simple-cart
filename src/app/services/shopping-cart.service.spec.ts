import { TestBed, inject } from '@angular/core/testing';

import { ShoppingCartService } from './shopping-cart.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { StorageService, LocalStorageService } from './storage.service';
import { ProductsService } from './products.service';
import { DeliveryOptionsService } from './delivery-options.service';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs/Observable';
import { asyncData } from '../testing/async-observable-helpers';
import { DeliveryOption } from '../models/delivery-option.model';
import { Ingredient } from '../models/ingredient.model';
import { createOptional } from '@angular/compiler/src/core';
import { HttpModule } from '@angular/http';
import * as sinon from 'sinon';
import { ShoppingCart } from '../models/shopping-cart.model';

describe('ShoppingCartService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  const StorageServiceSpy = jasmine.createSpyObj('StorageService', [
    'cache',
    'get'
  ]);
  const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
  const deliveryOptionsServiceSpy = jasmine.createSpyObj(
    'DeliveryOptionsService',
    ['all']
  );
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const testProducts: Product[] = [];
    const fakeDeliveryOptions: DeliveryOption[] = [];
    deliveryOptionsServiceSpy.all.and.returnValue(
      asyncData(fakeDeliveryOptions)
    );

    productsServiceSpy.all.and.returnValue(asyncData(testProducts));
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        ShoppingCartService,
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: StorageService,
          useValue: StorageServiceSpy
        },
        {
          provide: DeliveryOptionsService,
          useValue: deliveryOptionsServiceSpy
        }
      ]
    });
  });

  it(
    'should be created',
    inject([ShoppingCartService], (service: ShoppingCartService) => {
      expect(service).toBeTruthy();
    })
  );
});

function createProducts(count: number): Product[] {
  const products = new Array<Product>();
  for (let i = 0; i < count; i += 1) {
    const product = new Product();
    product.id = i.toString();
    (product.name = `name ${i}`),
      (product.price = i),
      (product.ingredients = new Array<Ingredient>());
    products.push(product);
  }
  return products;
}

function createDeliveryOptions(count: number): DeliveryOption[] {
  const options = new Array<DeliveryOption>();
  for (let i = 0; i < count; i += 1) {
    const option = new DeliveryOption();
    option.id = i.toString();
    option.name = `name ${i}`;
    option.description = `description ${i}`;
    option.price = i;
    options.push(option);
  }

  return options;
}
/////////////////////////////////////////////////
const fakeProducts = createProducts(2);
const prod1 = fakeProducts[0];
const prod2 = fakeProducts[1];
const fakeOptions = createDeliveryOptions(2);
const delivOption1 = fakeOptions[0];
const delivOption2 = fakeOptions[1];
class MockProductsService extends ProductsService {
  public all(): Observable<Product[]> {
    const products = createProducts(2);
    return Observable.from([products]);
  }
}

class MockDeliveryOptionsService extends DeliveryOptionsService {
  public all(): Observable<DeliveryOption[]> {
    const options = createDeliveryOptions(2);
    return Observable.from([options]);
  }
}

describe('ShoppingCartService', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    const StorageServiceSpy = jasmine.createSpyObj('StorageService', [
      'cache',
      'get'
    ]);
    sandbox = sinon.sandbox.create();
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        { provide: ProductsService, useClass: MockProductsService },
        {
          provide: DeliveryOptionsService,
          useClass: MockDeliveryOptionsService
        },
        { provide: StorageService, useClass: LocalStorageService },
        ShoppingCartService
      ]
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it(
    'should be injectable',
    inject([ShoppingCartService], (service: ShoppingCartService) => {
      expect(service).toBeTruthy();
    })
  );

  describe('get()', () => {
    it(
      'should return an Observable<ShoppingCart>',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        const obs = service.get();
        expect(obs).toEqual(jasmine.any(Observable));
      })
    );

    it(
      'should return a ShoppingCart model instance when the observable is subscribed to',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        const obs = service.get();
        expect(obs).toEqual(jasmine.any(Observable));
        obs.subscribe(cart => {
          expect(cart).toEqual(
            jasmine.any(ShoppingCart),
            'expected ShoppingCart'
          );
          expect(cart.items.length).toEqual(0);
          expect(cart.deliveryOptionId).toBeUndefined();
          expect(cart.deliveryTotal).toEqual(0);
          expect(cart.itemsTotal).toEqual(0);
          expect(cart.grossTotal).toEqual(0);
        });
      })
    );

    it(
      'should return a populated shopping cart model instance when the observable is subscribed to',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        const shoppingCart = new ShoppingCart();
        shoppingCart.deliveryOptionId = 'deliveryOptionId';
        shoppingCart.deliveryTotal = 1;
        shoppingCart.itemsTotal = 2;
        shoppingCart.grossTotal = 3;
        sandbox
          .stub(localStorage, 'getItem')
          .returns(JSON.stringify(shoppingCart));

        const obs = service.get();
        obs.subscribe(cart => {
          expect(cart).toEqual(jasmine.any(ShoppingCart));
          expect(cart.deliveryOptionId).toEqual(shoppingCart.deliveryOptionId);
          expect(cart.deliveryTotal).toEqual(shoppingCart.deliveryTotal);
          expect(cart.itemsTotal).toEqual(shoppingCart.itemsTotal);
          expect(cart.grossTotal).toEqual(shoppingCart.grossTotal);
        });
      })
    );

    // next it
  });
  describe('empty()', () => {
    it(
      'should create empty cart and persist',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        const stub = sandbox.stub(localStorage, 'setItem');
        const obs = service.empty();
        sinon.assert.calledOnce(stub);
      })
    );

    it(
      'should dispatch empty cart',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        let dispatchCount = 0;
        const shoppingCart = new ShoppingCart();
        shoppingCart.grossTotal = 3;
        sandbox
          .stub(localStorage, 'getItem')
          .returns(JSON.stringify(shoppingCart));

        service.get().subscribe(cart => {
          dispatchCount += 1;
          if (dispatchCount === 1) {
            expect(cart.grossTotal).toEqual(shoppingCart.grossTotal);
          }
          if (dispatchCount === 2) {
            expect(cart.grossTotal).toEqual(0);
          }
        });
        service.empty();
        expect(dispatchCount).toEqual(2);
      })
    );

    // next it
  });

  describe('addItem()', () => {
    beforeEach(() => {
      let persistedCart: string;
      const setItemStub = sandbox
        .stub(localStorage, 'setItem')
        .callsFake((key, val) => (persistedCart = val));
      sandbox.stub(localStorage, 'getItem').callsFake(key => persistedCart);
    });

    it(
      'should add the item to the cart and persist',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        service.addItem(prod1, 1);

        service.get().subscribe(cart => {
          expect(cart.items.length).toEqual(1);
          expect(cart.items[0].productId).toEqual(prod1.id);
        });
      })
    );

    it(
      'should dispatch cart',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        let dispatchCount = 0;

        service.get().subscribe(cart => {
          dispatchCount += 1;
          if (dispatchCount === 2) {
            expect(cart.grossTotal).toEqual(prod1.price);
          }
        });

        service.addItem(prod1, 1);
        expect(dispatchCount).toEqual(2);
      })
    );

    it(
      'should set the correct quantity on products already added to the cart',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        service.addItem(prod1, 1);
        service.addItem(prod1, 3);
        service.get().subscribe(cart => {
          expect(cart.items[0].quantity).toEqual(4);
        });
      })
    );
    // next it
  });
  describe('setDeliveryOption()', () => {
    beforeEach(() => {
      let persistedCart: string;
      const setItemStub = sandbox
        .stub(localStorage, 'setItem')
        .callsFake((key, val) => (persistedCart = val));
      sandbox.stub(localStorage, 'getItem').callsFake(key => persistedCart);
    });

    it(
      'should add the delivery option to the cart and persist',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        service.setDeliveryOption(delivOption1);

        service.get().subscribe(cart => {
          expect(cart.deliveryOptionId).toEqual(delivOption1.id);
        });
      })
    );
    it(
      'should dispatch cart',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        let dispatchCount = 0;
        service.get().subscribe(cart => {
          dispatchCount += 1;
          if (dispatchCount === 2) {
            expect(cart.deliveryTotal).toEqual(delivOption1.price);
          }
        });
        service.setDeliveryOption(delivOption1);
        expect(dispatchCount).toEqual(2);
      })
    );
    // next it
  });

  describe('totals calculation', () => {
    beforeEach(() => {
      let persistedCart: string;
      const setItemStub = sandbox
        .stub(localStorage, 'setItem')
        .callsFake((key, val) => (persistedCart = val));
      sandbox.stub(localStorage, 'getItem').callsFake(key => persistedCart);
    });

    it(
      'should calculate the shopping cart totals correctly',
      inject([ShoppingCartService], (service: ShoppingCartService) => {
        service.addItem(prod1, 2);
        service.addItem(prod2, 1);
        service.addItem(prod1, 1);
        service.setDeliveryOption(delivOption1);

        service.get().subscribe(cart => {
          expect(cart.items.length).toEqual(2);
          expect(cart.deliveryTotal).toEqual(delivOption1.price);
          expect(cart.itemsTotal).toEqual(prod1.price * 3 + prod2.price * 1);
          expect(cart.grossTotal).toEqual(
            prod1.price * 3 + prod2.price * 1 + delivOption1.price
          );
        });
      })
    );
    // next it
  });
  // next describe
});
