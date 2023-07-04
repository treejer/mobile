export type TAssignedTreeRes = {
  _id: string;
  signer: string;
  nonce: number;
  treeId: number;
  treeSpecs: string;
  birthDate: number;
  countryCode: number;
  signature: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type TAssignedTreePayload = {
  treeId: number;
  birthDate: number;
  treeSpecs: string;
  treeSpecsJSON: string;
  signature: string;
};

export type TAssignedTreeForm = {
  treeId: number;
  treeSpecs: string;
  treeSpecsJSON: string;
  birthDate: number;
  countryCode: number;
  signature: string;
};

export type TAssignedTreeAction = {
  type: string;
  payload: TAssignedTreePayload;
};
