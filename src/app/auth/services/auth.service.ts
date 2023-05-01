import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CredentialsService } from '../../core/services/credentials.service';
import { Subject } from 'rxjs';
import { ILogin, IRegister } from '../../shared/models/auth.model';
import { environment } from '../../../environments/environment';
import {
  LoginResponse,
  RegisterResponse,
} from '../../shared/models/http.model';
import { CartsService } from '../../cart/services/carts.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authStatusListener = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private credentialsService: CredentialsService,
    private cartsService: CartsService
  ) {}

  register(registerData: IRegister) {
    return this.httpClient.post<RegisterResponse>(
      environment.apiUrl + '/auth/register',
      registerData
    );
  }

  login(loginData: ILogin) {
    return this.httpClient.post<LoginResponse>(
      environment.apiUrl + '/auth/login',
      loginData
    );
  }

  getUserInfo() {
    return this.httpClient.get(environment.apiUrl + '/user/info');
  }

  profile() {
    return this.httpClient.get(environment.apiUrl + '/user/info');
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  setAuthenticated(value: boolean) {
    this.authStatusListener.next(value);
  }

  logout() {
    this.credentialsService.setCredentials();
    this.cartsService.emptyLocalCart();
    this.authStatusListener.next(false);
  }
}
