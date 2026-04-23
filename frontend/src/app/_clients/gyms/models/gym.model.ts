export interface GymModel {
  _id?: string;
  gymName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  subscriptionPlan?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
