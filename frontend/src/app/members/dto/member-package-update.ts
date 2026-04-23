export class MemberPackageDto {
  packageName: string;
  durationDays: number;
  numberOfSessions: number;
  price: number;
  startDate: string | Date;
  notes?: string;

  constructor(data: any) {
    this.packageName = data.packageName;
    this.durationDays = data.durationDays;
    this.numberOfSessions = data.numberOfSessions;
    this.price = data.price;
    this.startDate = data.startDate;
    this.notes = data.notes;
  }

  toJSON() {
    return {
      packageName: this.packageName,
      durationDays: this.durationDays,
      numberOfSessions: this.numberOfSessions,
      price: this.price,
      startDate: this.startDate,
      notes: this.notes,
    };
  }
}
