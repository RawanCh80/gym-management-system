export interface MemberInterface {
  _id?: string;
  fullName: string;
  phone: string;
  membershipName: string;
  durationDays: number;
  numberOfSessions: number;
  price: number;
  membershipStart: string | Date;
  membershipEnd?: string | Date;
  notes?: string;
  isActive?: boolean;
}
