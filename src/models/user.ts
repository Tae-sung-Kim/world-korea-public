// 회원

import { UserType } from '@/types/user';
import {
  model,
  models,
  Schema,
  Model,
  HydratedDocument,
  Types,
} from 'mongoose';

export interface IUser {
  loginId: string;
  name: string;
  password: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  isAdmin: boolean;
  type: object;
}

interface IUserMethods {
  fullName(): string;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  getUserList(): UserType[];
}

const schema = new Schema<IUser, UserModel, IUserMethods>({
  // 로그인 ID
  loginId: {
    type: String,
    required: true,
  },

  // 이름
  name: {
    type: String,
    required: true,
  },

  // 이메일
  email: {
    type: String,
    required: true,
  },

  // 비밀번호
  password: {
    type: String,
    required: true,
  },

  // 폰번호
  phoneNumber: {
    type: String,
    required: true,
  },

  // 회사명
  companyName: {
    type: String,
  },

  // 관리자 여부
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // 회원 구분
  type: {
    type: Types.ObjectId,
    ref: 'UserCategory',
  },
});

schema.static('getUserList', function getUserList() {
  return this.find({}, '-password');
});

const User =
  (models.User as UserModel) || model<IUser, UserModel>('User', schema);

export default User;
