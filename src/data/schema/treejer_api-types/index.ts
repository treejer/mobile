export interface whereType {
  planter?: string | null;
}
export interface ApplyInput {
  firstName: string;
  lastName: string;
  idCardFile: string;
  type: string;
  organizationAddress: string;
  referrer: string;
  longitude: string;
  latitude: string;
}
export interface VerifyMobileInput {
  verificationCode: string;
}
export interface UpdateMobileInput {
  country: string;
  mobileNumber: string;
}
export type Web3Result = Record<string, any>;
export type Any = any;