export type TVerifyMobileRes = {
  message: string;
};

export type TVerifyMobilePayload = {
  verificationCode: string;
};

export type TVerifyMobileAction = {
  type: string;
  payload: TVerifyMobilePayload;
};
