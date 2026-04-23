import { UpdateAdminPasswordInterface } from '../../_clients/admins/interface/update-admin-password.interface';
import { UpdatePasswordAdminFormGroupInterface } from '../interfaces/update-password-admin-form-group.interface';

export class AdminPasswordUpdateDto {
  private readonly formData: UpdatePasswordAdminFormGroupInterface;

  constructor(formData: UpdatePasswordAdminFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): UpdateAdminPasswordInterface {
    return {
      oldPassword: this.formData.oldPassword,
      newPassword: this.formData.newPassword,
    };
  }
}
