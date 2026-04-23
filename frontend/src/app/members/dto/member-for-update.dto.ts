// import { MemberFormGroupInterface } from '../interfaces/member-form-group.interface';
// import { MemberInterface } from '../../_clients/members/interface/member-item.interface';
// import { MemberDetailsInterface } from '../../_clients/members/interface/member-details.interface';
//
// export class MemberForUpdateDto {
//   private readonly formData: MemberFormGroupInterface;
//
//   constructor(formData: MemberFormGroupInterface) {
//     this.formData = formData;
//   }
//   toJSON(): Partial<MemberDetailsInterface> {
//     const updates: Partial<MemberDetailsInterface> = {};
//
//     if (this.formData.fullName) {
//       updates.fullName = this.formData.fullName;
//     }
//
//     if (this.formData.phone) {
//       updates.phone = this.formData.phone;
//     }
//
//     if (this.formData.packageName) {
//       updates.packageName = this.formData.packageName;
//     }
//
//     if (this.formData.durationDays !== undefined) {
//       updates.durationDays = this.formData.durationDays;
//     }
//
//     if (this.formData.numberOfSessions !== undefined) {
//       updates.numberOfSessions = this.formData.numberOfSessions;
//     }
//
//     if (this.formData.price !== undefined) {
//       updates.price = this.formData.price;
//     }
//
//     if (this.formData.membershipStart) {
//       updates.membershipStart = new Date(this.formData.membershipStart);
//     }
//
//     if (this.formData.notes) {
//       updates.notes = this.formData.notes;
//     }
//
//     if (this.formData.isActive !== undefined) {
//       updates.isActive = this.formData.isActive;
//     }
//
//     return updates;
//   }
// }
export type MemberUpdateAction =
  | 'edit-member'
  | 'edit-package'
  | 'add-package';

export class MemberForUpdateDto {
  action: MemberUpdateAction;
  data: any;

  constructor(action: MemberUpdateAction, data: any) {
    this.action = action;
    this.data = data;
  }

  toJSON() {
    return {
      action: this.action,
      data: this.data,
    };
  }
}
