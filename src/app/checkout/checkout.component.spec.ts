import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { DeliveryOptionsService } from '../services/delivery-options.service';
import { Product } from '../models/product.model';
const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
  'get'
]);
const deliveryOptionsServiceSpy = jasmine.createSpyObj(
  'DeliveryOptionsService',
  ['all']
);

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(
    async(() => {
      let testProducts: Product[] = [];
      productsServiceSpy.all.and.returnValue(testProducts);
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
