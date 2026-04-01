import { MemberInterface } from '../../_clients/members/interface/members.interface';

export class MemberItemBo {
  id: string;
  fullName: string;
  phone: string;
  durationDays: number;
  numberOfSessions: number;
  price: number;
  isActive: boolean;

  constructor(memberModel: MemberInterface) {
    this.id = memberModel._id ?? '';
    this.fullName = memberModel.fullName;
    this.phone = memberModel.phone;
    this.durationDays = memberModel.durationDays;
    this.numberOfSessions = memberModel.numberOfSessions;
    this.price = memberModel.price;
    this.isActive = memberModel.isActive ?? true;
  }
}
