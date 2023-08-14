export type TMobileSendCodeRes = {
  message: string;
  mobile: string;
  mobileCountry: string;
};

export type TMobileSendCodePayload = {
  mobileNumber: string;
  country: string;
};

export type TMobileSendCodeAction = {
  type: string;
  payload: TMobileSendCodePayload;
};
