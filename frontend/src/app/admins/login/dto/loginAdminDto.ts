import { AuthInterface } from '../../../_clients/login/auth.interface';

export class LoginAdminDto implements AuthInterface {
  email: string;
  password: string;

  constructor(loginFormValue: { email: string, password: string }) {
    this.email = loginFormValue.email;
    this.password = loginFormValue.password;
  }

  toJSON(): AuthInterface {
    return { email: this.email, password: this.password };
  }
}
