import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
import { MemberInterface } from '../../_clients/members/interface/members.interface';

export class MemberForUpdateDto {
  private readonly formData: MemberFormGroupInterface;

  constructor(formData: MemberFormGroupInterface) {
    this.formData = formData;
  }

  toJSON(): Partial<MemberInterface> {
    const updates: Partial<MemberInterface> = {};

    if (this.formData.fullName) updates.fullName = this.formData.fullName;
    if (this.formData.phone) updates.phone = this.formData.phone;
    if (this.formData.membershipName) updates.membershipName = this.formData.membershipName;
    if (this.formData.durationDays !== undefined) updates.durationDays = this.formData.durationDays;
    if (this.formData.numberOfSessions !== undefined) updates.numberOfSessions = this.formData.numberOfSessions;
    if (this.formData.price !== undefined) updates.price = this.formData.price;
    if (this.formData.membershipStart) updates.membershipStart = new Date(this.formData.membershipStart);
    if (this.formData.notes) updates.notes = this.formData.notes;
    if (this.formData.isActive !== undefined) updates.isActive = this.formData.isActive;

    return updates;
  }
}
