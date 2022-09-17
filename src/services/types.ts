export interface UserSignRes {
  loginToken: string;
  userId: string;
  wallet: string;
}

export interface UserSignForm {
  signature: string;
  wallet: string;
}

export interface UserNonceForm {
  wallet: string;
  magicToken: string;
  loginData?: {mobile?: string; country?: string; email?: string};
}

export interface UserNonceRes {
  userId: string;
  message: string;
}
