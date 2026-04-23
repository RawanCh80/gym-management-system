import { MemberPackageInterface } from './member-package.interface';

export interface MemberFormGroupInterface {
  _id?: string;
  fullName: string;
  phone: string;
  packages: MemberPackageInterface[];
}
