import { GymInterface } from '../../_clients/gyms/interface/gym.interface';

export class GymItemBo {
  id: string;
  gymName: string;
  ownerName: string;
  phone: string;
  isActive: boolean;

  constructor(gymModel: GymInterface) {
    this.id = gymModel._id ?? '';
    this.gymName = gymModel.gymName;
    this.ownerName = gymModel.ownerName;
    this.phone = gymModel.phone;
    this.isActive = gymModel.isActive ?? true;
  }
}
