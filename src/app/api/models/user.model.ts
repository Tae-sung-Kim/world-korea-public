// 회원

import {
  UserHasPassword,
  User,
  PaginationParams,
  PaginationResponse,
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from '@/definitions';
import { model, models, Schema, Model, Types, SortOrder } from 'mongoose';
import '@/app/api/models/user-category.model';
import ProductModel from './product.model';

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
  getUserList(
    paginationParams: PaginationParams
  ): PaginationResponse<Promise<User[]>>;
  getUserById(userId: string): Promise<User>;
  getUserHasPasswordByLoginId(loginId: string): Promise<UserHasPassword>;
  getUserByLoginId(loginId: string): Promise<User>;
  updateUserPasswordById(userId: string, password: string): Promise<User>;

  getPartnerUserList(
    paginationParams: PaginationParams
  ): PaginationResponse<Promise<User[]>>;
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

schema.static(
  'getUserList',
  async function getUserList({
    pageNumber = PAGE_NUMBER_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    filter: filterQuery = null,
    sort: sortQuery = null,
  } = {}) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {};
    const sort: { [key: string]: SortOrder } =
      sortQuery && sortQuery.order !== ''
        ? { [sortQuery.name]: sortQuery.order === 'asc' ? 1 : -1 }
        : { createdAt: -1 }; // 최신순 정렬

    if (filterQuery) {
      Object.keys(filterQuery).forEach((key) => {
        const value = filterQuery[key];
        filter[key] = { $regex: value, $options: 'i' }; // 정규식 검색 적용
      });
    }

    // 총 개수 가져오기
    const totalItems = await this.countDocuments(filter);

    let list = await this.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'usercategories', // 참조하는 컬렉션 이름 (보통 모델명의 소문자 복수형)
          localField: 'userCategory',
          foreignField: '_id',
          as: 'userCategory',
        },
      },
      { $unwind: '$userCategory' }, // populate된 배열을 풀어줍니다
      { $sort: sort as Record<string, 1 | -1> },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          password: 0, // 비밀번호 필드 제외
        },
      },
    ]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItems / pageSize);

    // 페이지네이션 관련 정보 계산
    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;
    const previousPage = hasPreviousPage ? pageNumber - 1 : null;
    const nextPage = hasNextPage ? pageNumber + 1 : null;

    return {
      list,
      pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      startIndex: skip,
      endIndex: totalItems - 1,
    };
  }
);

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

schema.static(
  'getPartnerUserList',
  async function getPartnerUserList({
    pageNumber = PAGE_NUMBER_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    filter: filterQuery = null,
    sort: sortQuery = null,
  } = {}) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = { isPartner: true };
    const sort: { [key: string]: SortOrder } =
      sortQuery && sortQuery.order !== ''
        ? { [sortQuery.name]: sortQuery.order === 'asc' ? 1 : -1 }
        : { createdAt: -1 }; // 최신순 정렬

    if (filterQuery) {
      Object.keys(filterQuery).forEach((key) => {
        const value = filterQuery[key];
        filter[key] = { $regex: value, $options: 'i' }; // 정규식 검색 적용
      });
    }

    // 총 개수 가져오기
    const totalItems = await this.countDocuments(filter);

    // 데이터 가져오기
    let list = await this.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'usercategories', // 참조하는 컬렉션 이름 (보통 모델명의 소문자 복수형)
          localField: 'userCategory',
          foreignField: '_id',
          as: 'userCategory',
        },
      },
      { $unwind: '$userCategory' }, // populate된 배열을 풀어줍니다
      { $sort: sort as Record<string, 1 | -1> },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          password: 0, // 비밀번호 필드 제외
        },
      },
    ]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItems / pageSize);

    // 페이지네이션 관련 정보 계산
    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;
    const previousPage = hasPreviousPage ? pageNumber - 1 : null;
    const nextPage = hasNextPage ? pageNumber + 1 : null;

    return {
      list,
      pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      startIndex: skip,
      endIndex: totalItems - 1,
    };
  }
);

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
  async function updateUserPartnerProduct(partnerProductList) {
    // if (Array.isArray(partnerProductList)) {
    //   this.partnerProducts = partnerProductList;
    // }

    // this.updatedAt = new Date();

    // return this.save();

    if (Array.isArray(partnerProductList)) {
      // 기존 파트너 상품들에서 현재 파트너 ID 제거
      if (this.partnerProducts?.length) {
        const oldProducts = await ProductModel.find({
          _id: { $in: this.partnerProducts },
        });
        for (const product of oldProducts) {
          if (product.partner?.equals(this._id)) {
            // MongoDB $unset 연산자를 사용하여 필드 제거
            await ProductModel.updateOne(
              { _id: product._id },
              { $unset: { partner: '' } }
            );
          }
        }
      }

      // 새로운 파트너 상품들에 현재 파트너 ID 추가
      const products = await ProductModel.find({
        _id: { $in: partnerProductList },
      });
      for (const product of products) {
        product.partner = this._id;
        await product.save();
      }

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
