import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { CartOrder } from '../../../shared/models/order.model';
import { ProductsService } from '../../../products/services/products.service';
import { CartsService } from '../../services/carts.service';
import {
  CreateResponse,
  DeleteResponse,
  FetchResponse,
  UpdateResponse,
} from '../../../shared/models/http.model';
import { AuthService } from '../../../auth/services/auth.service';
import { CredentialsService } from '../../../core/services/credentials.service';
import { cartOrdersKey } from '../../../shared/models/product.model';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss'],
})
export class CartDetailsComponent implements OnInit, OnDestroy {
  cartOrders: CartOrder[] = [];
  total: number = 0;
  success: boolean = false;
  userId: number;

  private unSub$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private credentialsService: CredentialsService,
    private cartsService: CartsService
  ) {
    this.userId = this.credentialsService.credentials?.userId!;
  }

  loadOrders() {
    const localStoredOrders: CartOrder[] =
      JSON.parse(localStorage.getItem(cartOrdersKey) || '[]') || [];

    this.cartsService
      .getOrders({ filter: 'paid=0' })
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (res: FetchResponse<CartOrder>) => {
          console.log('res', res);
          this.cartOrders = res.docs;
          if (localStoredOrders.length > 0) {
            for (let i = 0; i < localStoredOrders.length; i++) {
              const localStoredOrder = localStoredOrders[i];
              const foundIndex = this.cartOrders.findIndex(
                (o) => o.product.id == localStoredOrder.product.id
              );
              if (foundIndex == -1) {
                this.cartOrders.push(localStoredOrder);
              } else {
                this.cartOrders[foundIndex].quantity +=
                  localStoredOrder.quantity;
              }
            }
          }
          this.calculateTotal();
        },
      });
  }

  calculateTotal() {
    this.total = 0;
    for (let i = 0; i < this.cartOrders.length; i++) {
      this.total +=
        this.cartOrders[i].quantity * this.cartOrders[i].product.price;
    }
  }

  onQuantityChange() {
    this.updateCartOrders();
  }

  increase(i: number) {
    this.cartOrders[i].quantity++;
    this.updateCartOrders();
  }

  decrease(i: number) {
    if (this.cartOrders[i].quantity > 1) {
      this.cartOrders[i].quantity--;
      this.updateCartOrders();
    }
  }

  onDelete(i: number) {
    const orderToDeleteId = this.cartOrders[i].id;
    this.deleteOrder(i, orderToDeleteId);
  }

  deleteOrder(index: number, id: number) {
    this.cartsService
      .deleteOrder(id)
      .pipe(takeUntil(this.unSub$))
      .subscribe({
        next: (res: DeleteResponse) => {
          console.log('delete res', res);
          this.cartOrders.splice(index, 1);
          this.updateCartOrders();
        },
        error: (errorRes) => {
          console.log('errorRes', errorRes);
        },
      });
  }

  clearCart() {
    const cartOrdersToDelete = [...this.cartOrders];
    for (let i = 0; i < cartOrdersToDelete.length; i++) {
      const cartOrder = cartOrdersToDelete[i];
      this.deleteOrder(i, cartOrder.id);
    }

    this.cartOrders = [];
    this.updateCartOrders();
  }

  saveCart() {
    this.updateCartOrders();
    this.cartOrders.forEach((cartOrder) => {
      if (cartOrder.id > 0) {
        this.cartsService
          .updateOrder(cartOrder.id, {
            paid: cartOrder.paid,
            productId: cartOrder.productId,
            quantity: cartOrder.quantity,
            userId: this.userId,
          })
          .pipe(takeUntil(this.unSub$))
          .subscribe({
            next: (res: UpdateResponse) => {
              console.log('update res', res);
              this.cartsService.emptyLocalCart();
            },
            error: (errorRes) => {
              console.log('errorRes', errorRes);
            },
          });
      } else {
        this.cartsService
          .createOrder({
            paid: cartOrder.paid,
            productId: cartOrder.productId,
            quantity: cartOrder.quantity,
            userId: this.userId,
          })
          .pipe(takeUntil(this.unSub$))
          .subscribe({
            next: (res: CreateResponse) => {
              console.log('create res', res);
              this.cartsService.emptyLocalCart();
            },
            error: (errorRes) => {
              console.log('errorRes', errorRes);
            },
          });
      }
    });
  }

  orderNow() {
    this.saveCart();

    const paidOrders = [...this.cartOrders];
    const updateObservables: Observable<UpdateResponse>[] = [];

    for (let i = 0; i < paidOrders.length; i++) {
      const cartOrder: CartOrder = paidOrders[i];
      cartOrder.paid = true;
      updateObservables.push(
        this.cartsService
          .updateOrder(cartOrder.id, {
            paid: cartOrder.paid,
            productId: cartOrder.productId,
            quantity: cartOrder.quantity,
            userId: this.userId,
          })
          .pipe(takeUntil(this.unSub$))
      );
    }

    forkJoin(updateObservables).subscribe({
      next: (resArray: UpdateResponse[]) => {
        console.log('ordering now res', resArray);
        this.cartOrders = [];
        this.success = true;
      },
      error: (errorRes) => {
        console.log('errorRes', errorRes);
      },
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  ngOnDestroy() {
    this.unSub$.next(true);
    this.unSub$.complete();
  }

  private updateCartOrders() {
    this.calculateTotal();
    localStorage.setItem(cartOrdersKey, JSON.stringify(this.cartOrders));
  }
}
