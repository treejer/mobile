export type TVerifyProfilePayload = {
  firstName: string;
  lastName: string;
  type: number;
  organizationAddress: string;
  referrer: string;
  longitude: number;
  latitude: number;
  file: string;
};

export type TVerifyProfileAction = {
  type: string;
  payload: TVerifyProfilePayload;
};
