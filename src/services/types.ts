export interface UserSignRes {
  loginToken: string;
  userId: string;
  wallet: string;
}

export interface UserSignForm {
  signature: string;
  wallet: string;
}

export interface UserNonceRes {
  userId: string;
  message: string;
}
