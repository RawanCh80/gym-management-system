import { MemberDetailsModel } from '../../_clients/members/models/Member-details.model';

export class MemberDetailsBo {
  id: string;
  fullName: string;
  phone: string;
  packages: [
    packageName: string,
    durationDays: number,
    numberOfSessions: number,
    price: number,
    startDate: string | Date,
    endDate: string | Date,
    isActive: boolean,
    createdAt?: string,
    updatedAt?: string,
    notes?: string,
  ]

  constructor(memberModel: MemberDetailsModel) {
    this.id = memberModel._id ?? '';
    this.fullName = memberModel.fullName;
    this.phone = memberModel.phone;
    this.packages = memberModel.packages;
  }
}
