import { MemberInterface } from '../../_clients/members/interface/members.interface';

export class MemberDetailsBo {
  id: string;
  fullName: string;
  phone: string;
  membershipName?: string;
  durationDays: number;
  numberOfSessions: number;
  price: number;
  membershipStart: Date;
  membershipEnd?: Date;
  isActive: boolean;
  notes?: string;

  constructor(memberModel: MemberInterface) {
    this.id = memberModel._id ?? '';
    this.fullName = memberModel.fullName;
    this.phone = memberModel.phone;
    this.membershipName = memberModel.membershipName;
    this.durationDays = memberModel.durationDays;
    this.numberOfSessions = memberModel.numberOfSessions;
    this.price = memberModel.price;
    this.membershipStart = new Date(memberModel.membershipStart);
    this.membershipEnd = memberModel.membershipEnd ? new Date(memberModel.membershipEnd) : undefined;
    this.isActive = memberModel.isActive ?? true;
    this.notes = memberModel.notes;
  }
}
