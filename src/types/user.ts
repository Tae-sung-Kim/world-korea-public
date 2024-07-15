import { UserCategoryType } from './userCategory';

export type SignUpUserType = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export type SingInUserType = Pick<SignUpUserType, 'id' | 'password'>;

export type UserType = {
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

export type UserListType = UserType[];

export type UserJwtPayloadType = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export type SignInReturnType = string;

export type UserAuth = {
  isLoggedIn: boolean;
  isMe: boolean;
  isAdmin: boolean;
};
