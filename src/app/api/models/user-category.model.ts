// 회원분류

import connectMongo from '@/app/api/libs/database';
import { UserCategoryType } from '@/definitions';
import { model, models, Schema, Model } from 'mongoose';

export interface UserCategoryDB {
  name: string;
  level: number;
}

interface UserCategoryMethods {}

interface UserCategoryModel
  extends Model<UserCategoryDB, {}, UserCategoryMethods> {
  getUserCategoryList(): UserCategoryType[];
}

const schema = new Schema<
  UserCategoryDB,
  UserCategoryModel,
  UserCategoryMethods
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
  model<UserCategoryDB, UserCategoryModel>('UserCategory', schema);

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
