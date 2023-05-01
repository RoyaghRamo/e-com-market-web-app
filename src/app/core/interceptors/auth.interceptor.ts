import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '../services/credentials.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const request = this.credentialsService.isAuthenticated()
      ? req.clone({
          headers: req.headers.set(
            'Authorization',
            `Bearer ${this.credentialsService.credentials?.token}`
          ),
        })
      : req;

    return next.handle(request);
  }
}
