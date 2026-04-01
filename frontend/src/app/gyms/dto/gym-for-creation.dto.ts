import { GymFormGroupInterface } from '../interfaces/gym-form-group.interface';
import { GymInterface } from '../../_clients/gyms/interface/gym.interface';

export class GymForCreationDto {
  private readonly formData: GymFormGroupInterface;

  constructor(formData: GymFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): GymInterface {
    return {
      gymName: this.formData.gymName,
      ownerName: this.formData.ownerName,
      phone: this.formData.phone,
      email: this.formData.email,
      address: this.formData.address,
      subscriptionPlan: this.formData.subscriptionPlan ?? 'basic',
      isActive: this.formData.isActive ?? true
    };
  }
}
