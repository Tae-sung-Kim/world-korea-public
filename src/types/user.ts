export type SignUpUserType = {
  id: string;
  email: string;
  password: string;
};

export type SingInUserType = Pick<SignUpUserType, 'id' | 'password'>;

export type UserType = {
  id: string;
  email: string;
};

export type UserListType = Array<UserType>;
