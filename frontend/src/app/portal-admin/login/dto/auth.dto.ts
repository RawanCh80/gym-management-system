import { PortalLoginFormInterface } from '../interface/portal-login-form.interface';

export class AuthDto implements PortalLoginFormInterface {
  username: string;
  password: string;

  constructor(loginFormValue: { username: string, password: string }) {
    this.username = loginFormValue.username;
    this.password = loginFormValue.password;
  }

  toJSON(): PortalLoginFormInterface {
    return { username: this.username, password: this.password };
  }
}
