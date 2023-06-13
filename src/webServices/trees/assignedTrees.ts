import {PaginationRes} from 'webServices/pagination/pagination';
import {NotVerifiedTree} from 'types';

export type AssignedTree = {
  _id: string;
  signer: string;
  nonce: number;
  treeId: number;
  treeSpecs: string;
  birthDate: number;
  countryCode: number;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type TAssignedTreesRes = PaginationRes<NotVerifiedTree>;
export type TAssignedTreesPayload = {
  filters?: {signer: string; nonce: number};
  sort?: {signer: number; nonce: number};
};
export type TAssignedTreesAction = {
  type: string;
  payload: TAssignedTreesPayload;
};
