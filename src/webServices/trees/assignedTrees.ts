type AssignedTree = {
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

export type TAssignedTreesRes = AssignedTree[];
