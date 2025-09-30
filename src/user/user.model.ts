export interface UserCreateReq {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserCreateRep extends Partial<UserCreateReq> {
  id: string;
}

export interface UserAuthReq {
  email: string;
  password: string;
  rememberMe?: boolean;
}
