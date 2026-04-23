import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
import { MemberDetailsInterface } from '../../_clients/members/interface/member-details.interface';

export class MemberForCreationDto {
  private readonly formData: MemberFormGroupInterface;

  constructor(formData: MemberFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): MemberDetailsInterface {
    return {
      fullName: this.formData.fullName,
      phone: this.formData.phone,
      packages: this.formData.packages
    };
  }
}
