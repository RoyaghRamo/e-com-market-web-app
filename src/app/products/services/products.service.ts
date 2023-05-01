import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FetchResponse, Pagination } from '../../shared/models/http.model';
import { Category, Product } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpClient: HttpClient) {}

  getAllProducts(pagination?: Pagination) {
    return this.httpClient.get<FetchResponse<Product>>(
      environment.apiUrl + '/product',
      {
        params: {
          ...pagination,
        },
      }
    );
  }

  getProductById(id: number) {
    return this.httpClient.get<FetchResponse<Product>>(
      environment.apiUrl + '/product/' + id
    );
  }

  getCategoryById(id: number) {
    return this.httpClient.get<FetchResponse<Category>>(
      environment.apiUrl + '/category/' + id
    );
  }

  getAllCategories() {
    return this.httpClient.get<FetchResponse<Category>>(
      environment.apiUrl + '/category'
    );
  }
}
