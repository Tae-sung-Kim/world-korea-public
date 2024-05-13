export type SignUpUserType = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export type SingInUserType = Pick<SignUpUserType, 'id' | 'password'>;

export type UserType = {
  loginId: string;
  email: string;
  name: string;
};

export type UserListType = UserType[];

export type UserJwtPayloadType = {
  id: string;
  name: string;
};

export type SignInReturnType = string;
