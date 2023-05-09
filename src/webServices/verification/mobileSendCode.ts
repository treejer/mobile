export type TMobileSendCodeRes = {
  message: string;
  mobile: string;
  mobileCountry: string;
};

export type TMobileSendCodePayload = {
  mobile: string;
  mobileCountry: string;
};

export type TMobileSendCodeAction = {
  type: string;
  payload: TMobileSendCodePayload;
};
