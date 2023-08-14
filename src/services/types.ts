export interface UserSignRes {
  access_token: string;
  // userId: string;
  // wallet: string;
}

export interface UserSignForm {
  signature: string;
  wallet: string;
}

export interface UserNonceForm {
  wallet: string;
  magicToken: string;
  loginData?: {mobile?: string | null; country?: string | null; email?: string | null};
}

export interface UserNonceRes {
  userId: string;
  message: string;
}

export type TreejerCountry = {
  id: string;
  iso: string;
  name: string;
  nicename: string;
  iso3: string;
  numcode: number;
  phonecode: number;
};

export type CountiesRes = TreejerCountry[];
