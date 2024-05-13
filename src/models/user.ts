import { model, models, Schema } from 'mongoose';

export type UserSchemaType = {
  loginId: string;
  name: string;
  password: string;
  email: string;
};

const UserSchema = new Schema<UserSchemaType>({
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
const User = models.User || model('User', UserSchema);

export default User;
