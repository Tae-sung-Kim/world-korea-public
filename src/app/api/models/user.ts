// 회원

import { UserType } from '@/types/user';
import { model, models, Schema, Model, Types } from 'mongoose';

export interface IUser {
  loginId: string; // 아이디
  password: string; // 비밀번호
  companyNo: string; // 업체번호
  companyName: string; // 업체명
  address: string; // 주소
  contactNumber: string; // 연락처
  name: string; // 이름
  phoneNumber: string; // 폰번호
  email: string; // 이메일
  isApproved: boolean; // 승인 여부
  userCategory: object; // 회원 분류 Ref
  partner: object; // 파트너 Ref
  isAdmin: boolean; // 관리자 여부
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface IUserMethods {
  fullName(): string;
  updateUser(userData: IUser): boolean;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  getUserList(): UserType[];
  getUserById(userId: string): UserType;
  getUserByLoginId(userId: string): UserType;
  getUserAuthByLoginId(userId: string): UserType;
}

const schema = new Schema<IUser, UserModel, IUserMethods>({
  // 로그인 ID
  loginId: {
    type: String,
    required: true,
  },

  // 비밀번호
  password: {
    type: String,
    required: true,
  },

  // 업체번호
  companyNo: {
    type: String,
    default: '',
  },

  // 업체명
  companyName: {
    type: String,
    default: '',
  },

  // 주소
  address: {
    type: String,
    required: true,
  },

  // 연락처
  contactNumber: {
    type: String,
    required: true,
  },

  // 이름
  name: {
    type: String,
    required: true,
  },

  // 폰번호
  phoneNumber: {
    type: String,
    required: true,
  },

  // 이메일
  email: {
    type: String,
    required: true,
  },

  // 승인 여부
  isApproved: {
    type: Boolean,
    default: false,
  },

  // 회원구분 Ref
  userCategory: {
    type: Types.ObjectId,
    ref: 'UserCategory',
    default: null,
  },

  // 파트너 Ref
  partner: {
    type: Types.ObjectId,
    ref: 'Partner',
    default: null,
  },

  // 관리자 여부
  isAdmin: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },

  deletedAt: {
    type: Date,
  },
});

schema.static('getUserList', function getUserList() {
  return this.find({}, '-password').populate('userCategory');
});

schema.static('getUserById', function getUserById(userId) {
  return this.findOne({ _id: userId }, '-password').populate('userCategory');
});

schema.static('getUserByLoginId', function getUserByLoginId(userId) {
  return this.findOne({ loginId: userId }, '-password').populate(
    'userCategory'
  );
});

schema.static('getUserAuthByLoginId', function getUserAuthByLoginId(userId) {
  return this.findOne({ loginId: userId }, '-password');
});

schema.method('updateUser', function updateUser(userData) {
  if (typeof userData.userCategoryId === 'string') {
    this.userCategory = userData.userCategoryId;
  }
  this.isAdmin =
    typeof userData.isAdmin === 'boolean' ? userData.isAdmin : this.isAdmin;
  this.isApproved =
    typeof userData.isApproved === 'boolean'
      ? userData.isApproved
      : this.isApproved;
  this.companyName =
    typeof userData.companyName !== 'undefined'
      ? userData.companyName
      : this.companyName;
  this.companyNo =
    typeof userData.companyNo !== 'undefined'
      ? userData.companyNo
      : this.companyNo;
  this.address =
    typeof userData.address !== 'undefined' ? userData.address : this.address;
  this.contactNumber =
    typeof userData.contactNumber !== 'undefined'
      ? userData.contactNumber
      : this.contactNumber;
  this.name = typeof userData.name !== 'undefined' ? userData.name : this.name;
  this.phoneNumber =
    typeof userData.phoneNumber !== 'undefined'
      ? userData.phoneNumber
      : this.phoneNumber;
  this.email =
    typeof userData.email !== 'undefined' ? userData.email : this.email;
  this.updatedAt = new Date();

  return this.save();
});

const User =
  (models.User as UserModel) || model<IUser, UserModel>('User', schema);

export default User;
