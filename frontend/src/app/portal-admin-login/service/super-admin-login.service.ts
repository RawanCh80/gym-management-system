import { Injectable } from '@angular/core';

import { LoginFormInterface } from '../../login/interface/login-form.interface';
import { AuthDto } from '../../login/dto/auth.dto';
import { SuperAdminLoginClient } from '../../_clients/login/super-admin-login.client';

@Injectable({ providedIn: 'root' })
export class SuperAdminLoginService {
  constructor(
    private superAdminLoginClient: SuperAdminLoginClient) {
  }

  public login(loginFormValue: LoginFormInterface) {
    const loginDto = new AuthDto(loginFormValue);
    return this.superAdminLoginClient.login(loginDto.toJSON());

  }
}
