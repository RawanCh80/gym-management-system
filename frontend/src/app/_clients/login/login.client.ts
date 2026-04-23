import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInterface } from './auth.interface';

@Injectable({ providedIn: 'root' })

export class LoginClient {
  private readonly API_URL = 'http://localhost:3000/admins';

  constructor(private http: HttpClient) {
  }

  public login(loginFormValue: AuthInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }

  // public register(registerFormValue: RegisterFormInterface): Observable<any> {
  //   return this.http.post(`${this.API_URL}/register`, registerFormValue, this.authHeaders(token));
  // }
}
