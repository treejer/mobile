export type TPlantTreeRes = {
  _id: string;
  signer: string;
  nonce: number;
  treeSpecs: string;
  birthDate: number;
  countryCode: number;
  signature: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type TPlantTreePayload = {
  signature: string;
  treeSpecs: string;
  treeSpecsJSON: string;
  birthDate: number;
};

export type TPlantTreeForm = {
  signature: string;
  treeSpecs: string;
  treeSpecsJSON: string;
  birthDate: number;
  countryCode: number;
};

export type TPlantTreeAction = {
  type: string;
  payload: TPlantTreePayload;
};
