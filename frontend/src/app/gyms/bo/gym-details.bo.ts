import { GymInterface } from '../../_clients/gyms/interface/gym.interface';

export class GymDetailsBo {
  id: string;
  gymName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  subscriptionPlan?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(gymModel: GymInterface) {
    this.id = gymModel._id ?? '';
    this.gymName = gymModel.gymName;
    this.ownerName = gymModel.ownerName;
    this.phone = gymModel.phone;
    this.email = gymModel.email;
    this.address = gymModel.address;
    this.subscriptionPlan = gymModel.subscriptionPlan;
    this.isActive = gymModel.isActive ?? true;
    this.createdAt = gymModel.createdAt
      ? new Date(gymModel.createdAt)
      : undefined;
    this.updatedAt = gymModel.updatedAt
      ? new Date(gymModel.updatedAt)
      : undefined;
  }
}
