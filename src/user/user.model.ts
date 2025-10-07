export interface UserCreateReq {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  address?: Address[];
}

export interface UserCreateRep extends Partial<UserCreateReq> {
  id: string;
}

export interface UserAuthReq {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface Address {
  cep: string;
  street: string;
  streetNumber: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}
