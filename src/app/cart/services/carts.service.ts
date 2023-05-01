import { Injectable } from '@angular/core';
import { cartOrdersKey } from '../../shared/models/product.model';
import { HttpClient } from '@angular/common/http';
import {
  CreateResponse,
  DeleteResponse,
  FetchResponse,
  Pagination,
  UpdateResponse,
} from '../../shared/models/http.model';
import { CartOrder, Order } from '../../shared/models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  constructor(private httpClient: HttpClient) {}

  getOrders(pagination?: Pagination) {
    return this.httpClient.get<FetchResponse<CartOrder>>(
      environment.apiUrl + '/order',
      {
        params: { ...pagination },
      }
    );
  }

  createOrder(order: Partial<Order>) {
    return this.httpClient.post<CreateResponse>(
      environment.apiUrl + '/order',
      order
    );
  }

  updateOrder(id: number, order: Partial<Order>) {
    return this.httpClient.patch<UpdateResponse>(
      environment.apiUrl + '/order/' + id,
      order
    );
  }

  deleteOrder(id: number) {
    return this.httpClient.delete<DeleteResponse>(
      environment.apiUrl + '/order/' + id
    );
  }

  emptyLocalCart() {
    localStorage.removeItem(cartOrdersKey);
  }
}
