import { MemberItemModel } from '../../_clients/members/models/Member-item.model';

export class MemberItemBo {
  id: string;
  fullName: string;
  phone: string;

  constructor(memberModel: MemberItemModel) {
    this.id = memberModel._id ?? '';
    this.fullName = memberModel.fullName;
    this.phone = memberModel.phone;
  }
}
