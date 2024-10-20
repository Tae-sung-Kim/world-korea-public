// 회원

import { UserHasPassword, User } from '@/definitions';
import { model, models, Schema, Model, Types } from 'mongoose';
import '@/app/api/models/user-category.model';

interface UserDB {
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
  userCategory: Types.ObjectId; // 회원 분류 Ref
  isAdmin: boolean; // 관리자 여부
  isPartner: boolean; // 파트너 여부
  partnerProducts: Types.ObjectId[]; // 파트너 상품
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface UserMethods {
  fullName(): string;
  updateUser(userData: UserDB): Promise<boolean>;
  updateUserPartnerProduct(partnerProductList: string[]): Promise<boolean>;
}

interface UserSchemaModel extends Model<UserDB, {}, UserMethods> {
  getUserList(): Promise<User[]>;
  getUserById(userId: string): Promise<User>;
  getUserHasPasswordByLoginId(loginId: string): Promise<UserHasPassword>;
  getUserByLoginId(loginId: string): Promise<User>;
  updateUserPasswordById(userId: string, password: string): Promise<User>;

  getPartnerUserList(): Promise<User[]>;
}

const schema = new Schema<UserDB, UserSchemaModel, UserMethods>({
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
    type: Schema.Types.ObjectId,
    ref: 'UserCategory',
    default: null,
  },

  // 관리자 여부
  isAdmin: {
    type: Boolean,
    default: false,
  },

  // 파트너 여부
  isPartner: {
    type: Boolean,
    default: false,
  },

  // 파트너 상품
  partnerProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],

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

schema.static(
  'getUserHasPasswordByLoginId',
  function getUserHasPasswordByLoginId(loginId) {
    return this.findOne({ loginId }).populate('userCategory');
  }
);

schema.static('getUserByLoginId', function getUserByLoginId(loginId) {
  return this.findOne({ loginId }, '-password').populate('userCategory');
});

schema.static(
  'updateUserPasswordById',
  function updateUserPasswordById(userId, password) {
    return this.findByIdAndUpdate(userId, {
      password,
      updatedAt: new Date(),
    });
  }
);

/**
 * 파트너 목록 반환
 */
schema.static('getPartnerUserList', function getPartnerUserList() {
  return this.find({ isPartner: true }, '-password').populate('userCategory');
});

/**
 * 유저 정보 업데이트
 */
schema.method('updateUser', function updateUser(userData) {
  if (typeof userData.userCategoryId === 'string') {
    this.userCategory = userData.userCategoryId;
  }
  if (typeof userData.isAdmin === 'boolean') {
    this.isAdmin = userData.isAdmin;
  }
  if (typeof userData.isPartner === 'boolean') {
    this.isPartner = userData.isPartner;
  }
  if (typeof userData.isApproved === 'boolean') {
    this.isApproved = userData.isApproved;
  }
  if (typeof userData.companyName === 'string') {
    this.companyName = userData.companyName;
  }
  if (typeof userData.companyNo === 'string') {
    this.companyNo = userData.companyNo;
  }
  if (typeof userData.address === 'string') {
    this.address = userData.address;
  }
  if (typeof userData.contactNumber === 'string') {
    this.contactNumber = userData.contactNumber;
  }
  if (typeof userData.name === 'string') {
    this.name = userData.name;
  }
  if (typeof userData.phoneNumber === 'string') {
    this.phoneNumber = userData.phoneNumber;
  }
  if (typeof userData.email === 'string') {
    this.email = userData.email;
  }
  this.updatedAt = new Date();

  return this.save();
});

/**
 * 파트너 상품 업데이트
 */
schema.method(
  'updateUserPartnerProduct',
  function updateUserPartnerProduct(partnerProductList) {
    if (Array.isArray(partnerProductList)) {
      this.partnerProducts = partnerProductList;
    }

    this.updatedAt = new Date();

    return this.save();
  }
);

const UserModel =
  (models.User as UserSchemaModel) ||
  model<UserDB, UserSchemaModel>('User', schema);

export default UserModel;
