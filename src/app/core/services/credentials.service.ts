import { Injectable } from '@angular/core';

export interface ICredentials {
  token: string;
  userId: number;
}

const credentialsKey: string = 'credentials';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  constructor() {
    const savedCredentials =
      sessionStorage.getItem(credentialsKey) ||
      localStorage.getItem(credentialsKey);

    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  private _credentials: ICredentials | null = null;

  get credentials(): ICredentials | null {
    return this._credentials;
  }

  isAuthenticated(): boolean {
    return !!this._credentials;
  }

  setCredentials(credentials?: ICredentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
