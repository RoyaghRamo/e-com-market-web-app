import { BaseModel } from './base.model';

export interface Product extends BaseModel {
  userId: number;
  categoryId: number;
  title: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Category extends BaseModel {
  title: string;
}

export const cartOrdersKey: string = 'cart';
