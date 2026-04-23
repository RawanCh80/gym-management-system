import { Injectable } from '@angular/core';

import { LoginAdminFormInterface } from '../login/interface/login-form.interface';
import { LoginAdminDto } from '../login/dto/loginAdminDto';
import { LoginClient } from '../../_clients/login/login.client';

@Injectable({ providedIn: 'root' })
export class LoginAdminService {
  constructor(
    private loginClient: LoginClient) {
  }

  public login(loginFormValue: LoginAdminFormInterface) {
    const loginDto = new LoginAdminDto(loginFormValue);
    return this.loginClient.login(loginDto.toJSON());
  }

  // public register(registerFormValue: RegisterFormInterface) {
  //   const registerDto = new RegisterDto(registerFormValue);
  //   return this.loginClient.register(registerDto.toJSON());
  // }
}

