export type TVerifyMobileRes = string;

export type TVerifyMobilePayload = {
  verifyMobileCode: string;
};

export type TVerifyMobileAction = {
  type: string;
  payload: TVerifyMobilePayload;
};
