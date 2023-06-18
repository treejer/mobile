import {PaginationRes} from 'webServices/pagination/pagination';
import {NotVerifiedTree, TreeStatus} from 'types';

export type UpdatedTree = {
  _id: string;
  signer: string;
  nonce: number;
  treeId: number;
  treeSpecs: string;
  status: TreeStatus;
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
