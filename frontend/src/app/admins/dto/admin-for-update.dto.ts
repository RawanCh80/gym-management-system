import { UpdateAdminFormGroupInterface } from '../interfaces/update-admin-form-group.interface';
import { UpdateAdminInterface } from '../../_clients/admins/interface/update-admin.interface';

export class AdminForUpdateDto {
  private readonly formData: UpdateAdminFormGroupInterface;

  constructor(formData: UpdateAdminFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): UpdateAdminInterface {
    return {
      username: this.formData.username,
      email: this.formData.email,
      gymId: this.formData.gymId
    };
  }
}
