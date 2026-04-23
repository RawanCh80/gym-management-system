import { AdminModel } from '../../_clients/admins/models/admin.model';

export class AdminItemBo {
  id: string;
  email: string;
  username: string;
  gymId?: string;

  constructor(adminModel: AdminModel) {
    this.id = adminModel._id ?? '';
    this.gymId = adminModel.gymId;
    this.username = adminModel.username;
    this.email = adminModel.email;
  }
}
