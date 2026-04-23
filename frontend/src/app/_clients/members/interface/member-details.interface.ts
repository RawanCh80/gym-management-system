import { MemberPackageInterface } from '../../../members/interfaces/member-package.interface';

export interface MemberDetailsInterface {
  fullName: string;
  phone: string;
  packages: MemberPackageInterface[];
}


