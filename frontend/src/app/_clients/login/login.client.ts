import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginFormInterface } from '../../login-page/interface/login-form.interface';
import { HttpClient } from '@angular/common/http';
import { RegisterFormInterface } from '../../reigister-page/interface/register-form.interface';

@Injectable({ providedIn: 'root' })

export class LoginClient {
  private readonly API_URL = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {
  }

  public login(loginFormValue: LoginFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }

  public register(registerFormValue: RegisterFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, registerFormValue);
  }
}
