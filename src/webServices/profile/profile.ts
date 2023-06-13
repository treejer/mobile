export enum TUserStatus {
  NotVerified = 1,
  Pending = 2,
  Verified = 3,
}

export type TProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt?: string | null;
  idCard?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  mobile?: string | null;
  mobileCountry?: string | null;
  mobileVerifiedAt?: string | null;
  // isVerified: boolean;
  plantingNonce: number;
  userStatus: TUserStatus;
};
