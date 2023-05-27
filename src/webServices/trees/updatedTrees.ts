type UpdatedTree = {
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

export type TUpdatedTreesRes = UpdatedTree[];
