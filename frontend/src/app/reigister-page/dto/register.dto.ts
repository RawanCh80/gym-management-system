import { AuthInterface } from '../../_clients/login/auth.interface';
import { RegisterFormInterface } from '../interface/register-form.interface';

export class RegisterDto implements AuthInterface {
  username: string;
  password: string;
  gymId: string;
  email: string;

  constructor(registerFormInterface: RegisterFormInterface) {
    this.username = registerFormInterface.username;
    this.email = registerFormInterface.email;
    this.password = registerFormInterface.password;
    this.gymId = registerFormInterface.gymId;
  }

  toJSON() {
    return this;
  }
}

