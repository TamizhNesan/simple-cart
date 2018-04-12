import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StoreFrontComponent } from './store-front/store-front.component';

import { ProductsService } from './services/products.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import {
  StorageService,
  LocalStorageService
} from './services/storage.service';

@NgModule({
  declarations: [AppComponent, StoreFrontComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    ProductsService,
    ShoppingCartService,
    LocalStorageService,
    { provide: StorageService, useClass: LocalStorageService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
