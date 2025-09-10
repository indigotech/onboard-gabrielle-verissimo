export interface UserReq {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface UserRep extends Partial<UserReq> {
  id: string;
}
