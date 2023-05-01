import { Product } from './product.model';
import { BaseModel } from './base.model';

export interface Order extends BaseModel {
  productId: number;
  quantity: number;
  paid: boolean;
}

export interface CartOrder extends Order {
  product: Product;
}
