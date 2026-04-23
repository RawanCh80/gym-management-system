export interface MemberFormGroupInterface {
  _id?: string;
  fullName: string;
  phone: string;
  packages: [
    packageName: string,
    durationDays: number,
    numberOfSessions: number,
    price: number,
    startDate: string | Date,
    isActive: boolean,
    notes?: string,
  ]
}
