// 회원

// import { UserCategoryType } from '@/types/UserCategory';
import {
  model,
  models,
  Schema,
  Model,
  HydratedDocument,
  Types,
} from 'mongoose';

export interface IUserCategory {
  name: string;
  isAdmin: boolean;
}

interface IUserCategoryMethods {}

interface UserCategoryModel
  extends Model<IUserCategory, {}, IUserCategoryMethods> {}

const schema = new Schema<
  IUserCategory,
  UserCategoryModel,
  IUserCategoryMethods
>({
  name: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

schema.static('getUserCategoryList', function getUserCategoryList() {
  return this.find({}, '-password');
});

const UserCategory =
  (models.UserCategory as UserCategoryModel) ||
  model<IUserCategory, UserCategoryModel>('UserCategory', schema);

export default UserCategory;
