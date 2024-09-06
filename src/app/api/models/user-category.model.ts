// 회원분류

import connectMongo from '@/app/api/libs/database';
import {
  USER_CATEGORY_LEVEL_DEFAULT,
  USER_CATEGORY_NAME_DEFAULT,
  UserCategory,
} from '@/definitions';
import { model, models, Schema, Model } from 'mongoose';

export interface UserCategoryDB {
  name: string;
  level: string;
}

interface UserCategoryMethods {}

interface UserCategorySchemaModel
  extends Model<UserCategoryDB, {}, UserCategoryMethods> {
  getUserCategoryList(): UserCategory[];
}

const schema = new Schema<
  UserCategoryDB,
  UserCategorySchemaModel,
  UserCategoryMethods
>({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
});

schema.static('getUserCategoryList', function getUserList() {
  return this.find({});
});

const UserCategoryModel =
  (models.UserCategory as UserCategorySchemaModel) ||
  model<UserCategoryDB, UserCategorySchemaModel>('UserCategory', schema);

export async function initUserCategory() {
  await connectMongo();

  const len = await UserCategoryModel.countDocuments();

  if (len === 0) {
    await UserCategoryModel.create({
      name: USER_CATEGORY_NAME_DEFAULT,
      level: USER_CATEGORY_LEVEL_DEFAULT,
    });
  }
}

export default UserCategoryModel;
