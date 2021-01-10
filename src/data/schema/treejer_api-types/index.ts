export type Web3Result = Record<string, any>;
export interface ApplyInput {
  fullName: string;
  idCardUri: string;
  name: string;
  idCard: string;
  type: string;
}
export interface VerifyMobileInput {
  token: string;
}
export type Any = any;
export interface UpdateMobileInput {
  mobile: string;
  mobileCountry: string;
}