export class MemberEditDto {
  fullName?: string;
  phone?: string;

  constructor(data: any) {
    this.fullName = data.fullName;
    this.phone = data.phone;
  }

  toJSON() {
    return this;
  }
}
