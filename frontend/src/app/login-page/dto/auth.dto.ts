import { AuthInterface } from '../../_clients/login/auth.interface';

export class AuthDto implements AuthInterface {
  username: string;
  password: string;

  constructor(loginFormValue: { username: string, password: string }) {
    this.username = loginFormValue.username;
    this.password = loginFormValue.password;
  }

  toJSON(): AuthInterface {
    return { username: this.username, password: this.password };
  }
}
