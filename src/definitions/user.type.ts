import { UserCategoryType } from './user-category.type';

export type User = {
  userCategory: UserCategoryType;
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

export interface UserHasPassword extends User {
  password: string;
}

export type UserListType = User[];

export type UserJwtPayloadType = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export type UserSessionType = {
  id: string;
  name: string;
  role: string;
};

export type SignInReturnType = string;

export type UserAuth = {
  isLoggedIn: boolean;
  isMe: boolean;
  isAdmin: boolean;
};
