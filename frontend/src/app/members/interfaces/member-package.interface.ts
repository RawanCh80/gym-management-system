export interface MemberPackageInterface {
  packageName: string;
  durationDays: number;
  numberOfSessions: number;
  price: number;
  startDate: string | Date;
  isActive?: boolean;
  notes?: string;
}
