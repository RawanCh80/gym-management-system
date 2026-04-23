import { GymModel } from '../../_clients/gyms/models/gym.model';

export class GymItemBo {
  id: string;
  gymName: string;
  ownerName: string;
  phone: string;
  isActive: boolean;
  address: string;

  constructor(gymModel: GymModel) {
    this.id = gymModel._id ?? '';
    this.gymName = gymModel.gymName;
    this.ownerName = gymModel.ownerName;
    this.phone = gymModel.phone;
    this.isActive = gymModel.isActive ?? true;
    this.address = gymModel.address;
  }
}
