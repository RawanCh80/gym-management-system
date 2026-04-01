import { HttpClient } from '@angular/common/http';
import { LoginFormInterface } from '../../login/interface/login-form.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class SuperAdminLoginClient {
  private readonly API_URL = 'http://localhost:3000/super-admin';

  constructor(private http: HttpClient) {
  }

  public login(loginFormValue: LoginFormInterface): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginFormValue);
  }
}
