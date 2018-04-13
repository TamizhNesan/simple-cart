import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartComponent } from './shopping-cart.component';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Product } from '../models/product.model';
import { asyncData } from '../testing/async-observable-helpers';
import { ShoppingCart } from '../models/shopping-cart.model';
const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
  'get'
]);

describe('ShoppingCartComponent', () => {
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
