import { UserType } from '@/types/user';
import { model, models, Schema, Model, HydratedDocument } from 'mongoose';

export interface IUser {
  loginId: string;
  name: string;
  password: string;
  email: string;
}

interface IUserMethods {
  fullName(): string;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  // getUserList(): Promise<HydratedDocument<IUser, IUserMethods>>;
  getUserList(): UserType[];
}

const schema = new Schema<IUser, UserModel, IUserMethods>({
  loginId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

schema.static('getUserList', function getUserList() {
  return this.find({}, '-password');
});

const User =
  (models.User as UserModel) || model<IUser, UserModel>('User', schema);

export default User;
