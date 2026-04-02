import { AdminFormGroupInterface } from '../interfaces/admin-form-group.interface';
import { AdminInterface } from '../../_clients/admins/interface/admin.interface';

export class AdminForUpdateDto {
  private readonly formData: AdminFormGroupInterface;

  constructor(formData: AdminFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): AdminInterface {
    return {
      username: this.formData.username,
      password: this.formData.password,
    };
  }
}
