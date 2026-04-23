import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthSuperAdminInterface } from './auth-super-admin.interface';

@Injectable({ providedIn: 'root' })

export class SuperAdminLoginClient {
  private readonly API_URL = 'http://localhost:3000/super-admin';

  constructor(private http: HttpClient) {
  }

  public login(loginFormValue: AuthSuperAdminInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }
}
