import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() orderEmitter = new EventEmitter();
  addButton: boolean = false;
  quantity: number = 0;

  add() {
    this.orderEmitter.emit({
      item: this.product,
      quantity: this.quantity,
    });

    this.quantity = 0;
    this.addButton = false;
  }
}
