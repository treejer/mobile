export type TUpdateTreeRes = {
  _id: string;
  signer: string;
  nonce: number;
  treeId: number;
  treeSpecs: string;
  signature: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type TUpdateTreePayload = {
  treeId: number;
  treeSpecs: string;
  treeSpecsJSON: string;
  signature: string;
};

export type TUpdateTreeAction = {
  type: string;
  payload: TUpdateTreePayload;
};
