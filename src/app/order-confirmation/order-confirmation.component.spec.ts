import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';

import { OrderConfirmationComponent } from './order-confirmation.component';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ProductsService } from '../services/products.service';
import { DeliveryOptionsService } from '../services/delivery-options.service';
import {
  StorageService,
  LocalStorageService
} from '../services/storage.service';
import sinon = require('sinon');

describe('OrderConfirmationComponent', () => {
  const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
    'empty'
  ]);
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderConfirmationComponent],
        providers: [
          { provide: ShoppingCartService, useValue: shoppingCartServiceSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class MockShoppingCartService {
  public emptyCalled = false;
  public empty(): void {
    this.emptyCalled = true;
  }
}

describe('OrderConfirmationComponent', () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrderConfirmationComponent],
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
      const fixture = TestBed.createComponent(OrderConfirmationComponent);
      const component = fixture.debugElement.componentInstance;
      expect(component).toBeTruthy();
    })
  );

  it(
    'should call empty on shopping cart service when initialized',
    async(
      inject([ShoppingCartService], (service: MockShoppingCartService) => {
        const fixture = TestBed.createComponent(OrderConfirmationComponent);
        fixture.detectChanges();
        expect(service.emptyCalled).toBeTruthy();
      })
    )
  );
});
