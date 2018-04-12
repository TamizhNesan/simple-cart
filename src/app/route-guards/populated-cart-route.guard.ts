import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class PopulatedCartRouteGuard implements CanActivate {
  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const cartSubscription = this.shoppingCartService
        .get()
        .subscribe(cart => {
          if (cart.items.length === 0) {
            observer.next(false);
            this.router.navigate(['/']);
          } else {
            observer.next(true);
          }
        });
      return () => cartSubscription.unsubscribe();
    });
  }
}
