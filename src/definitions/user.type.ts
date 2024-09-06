import { UserCategory } from './user-category.type';

export type User = {
  userCategory: UserCategory;
  _id: string;
  loginId: string;
  companyNo: string;
  companyName: string;
  email: string;
  contactNumber: string;
  phoneNumber: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  name: string;
  isApproved: boolean;
  isAdmin: boolean;
};

export type UserHasPassword = User & {
  password: string;
};
