import {PaginationRes} from 'webServices/pagination/pagination';
import {NotVerifiedTree} from 'types';

export type UpdatedTree = {
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

export type TUpdatedTreesRes = PaginationRes<NotVerifiedTree>;
export type TUpdatedTreesPayload = {
  filters?: {signer: string; nonce: number};
  sort?: {signer: number; nonce: number};
};
export type TUpdatedTreesAction = {
  type: string;
  payload: TUpdatedTreesPayload;
};
