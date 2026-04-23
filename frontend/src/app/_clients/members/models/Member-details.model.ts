export interface MemberDetailsModel {
  _id?: string;
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
}
