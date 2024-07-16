// 회원분류

import connectMongo from '@/app/api/libs/database';
import { UserCategoryType } from '@/types/userCategory';
import { model, models, Schema, Model } from 'mongoose';

export interface IUserCategory {
  name: string;
  level: number;
}

interface IUserCategoryMethods {}

interface UserCategoryModel
  extends Model<IUserCategory, {}, IUserCategoryMethods> {
  getUserCategoryList(): UserCategoryType[];
}

const schema = new Schema<
  IUserCategory,
  UserCategoryModel,
  IUserCategoryMethods
>({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

schema.static('getUserCategoryList', function getUserList() {
  return this.find({});
});

const UserCategory =
  (models.UserCategory as UserCategoryModel) ||
  model<IUserCategory, UserCategoryModel>('UserCategory', schema);

export async function initUserCategory() {
  await connectMongo();

  const len = await UserCategory.countDocuments();

  if (len === 0) {
    await UserCategory.create({
      name: '일반회원',
      level: 1,
    });
  }
}

export default UserCategory;
