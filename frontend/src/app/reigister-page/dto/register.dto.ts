import { AuthInterface } from '../../_clients/login/auth.interface';
import { RegisterFormInterface } from '../interface/register-form.interface';

export class RegisterDto implements AuthInterface {
  username: string;
  password: string;

  constructor(registerFormInterface: RegisterFormInterface) {
    this.username = registerFormInterface.username;
    this.password = registerFormInterface.password;
  }

  toJSON() {
    return this;
  }
}
