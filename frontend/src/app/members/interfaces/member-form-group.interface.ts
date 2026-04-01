export interface MemberFormGroupInterface {
  _id?: string;
  fullName: string;
  phone: string;
  membershipName?: string;
  durationDays: number;
  numberOfSessions: number;
  price: number;
  membershipStart: string | Date;
  notes?: string;
  isActive?: boolean;
}
