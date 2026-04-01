import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
import { MemberInterface } from '../../_clients/members/interface/members.interface';

export class MemberForCreationDto {
  private readonly formData: MemberFormGroupInterface;

  constructor(formData: MemberFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): MemberInterface {
    return {
      fullName: this.formData.fullName,
      phone: this.formData.phone,
      membershipName: this.formData.membershipName ?? '',
      durationDays: this.formData.durationDays,
      numberOfSessions: this.formData.numberOfSessions,
      price: this.formData.price,
      membershipStart: this.formData.membershipStart,
      notes: this.formData.notes
    };
  }
}
