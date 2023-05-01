import { Injectable } from '@angular/core';
import { cartOrdersKey } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  constructor() {}

  emptyLocalCart() {
    localStorage.removeItem(cartOrdersKey);
  }
}
