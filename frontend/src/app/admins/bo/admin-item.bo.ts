import { AdminInterface } from '../../_clients/admins/interface/admin.interface';

export class AdminItemBo {
  id: string;
  username: string;
  gymId?: string;

  constructor(gymModel: AdminInterface) {
    this.id = gymModel._id ?? '';
    this.gymId = gymModel.gymId;
    this.username = gymModel.username;
  }
}
