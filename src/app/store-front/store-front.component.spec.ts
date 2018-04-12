import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFrontComponent } from './store-front.component';
import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ShoppingCartService } from '../services/shopping-cart.service';
const productsServiceSpy = jasmine.createSpyObj('ProductsService', ['all']);
const shoppingCartServiceSpy = jasmine.createSpyObj('ShoppingCartService', [
  ''
]);
@Component({ selector: 'app-shopping-cart', template: '' })
class AppShoppingCartComponent {}

describe('StoreFrontComponent', () => {
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
