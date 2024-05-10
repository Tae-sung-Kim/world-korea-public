export type SignUpUserType = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export type SingInUserType = Pick<SignUpUserType, 'id' | 'password'>;

export type UserType = {
  id: string;
  email: string;
  name: string;
};

export type UserListType = Array<UserType>;

export type UserJwtPayloadType = {
  id: string;
};

export type SignInReturnType = string;
