import { Injectable } from '@angular/core';

import { SuperAdminLoginClient } from '../../../_clients/login/super-admin-login.client';
import { AuthDto } from '../dto/auth.dto';
import { PortalLoginFormInterface } from '../interface/portal-login-form.interface';

@Injectable({ providedIn: 'root' })
export class SuperAdminLoginService {
  constructor(
    private superAdminLoginClient: SuperAdminLoginClient) {
  }

  public login(loginFormValue: PortalLoginFormInterface) {
    const loginDto = new AuthDto(loginFormValue);
    return this.superAdminLoginClient.login(loginDto.toJSON());
  }
}
