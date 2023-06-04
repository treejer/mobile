import {PaginationRes} from 'webServices/pagination/pagination';

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

export type TUpdatedTreesRes = PaginationRes<UpdatedTree>;
export type TUpdatedTreesPayload = {
  filters?: {signer: string; nonce: number};
  sort?: {signer: number; nonce: number};
};

export type TUpdatedTreesAction = {
  type: string;
  payload: TUpdatedTreesPayload;
};
