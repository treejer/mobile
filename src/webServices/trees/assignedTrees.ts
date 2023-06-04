import {PaginationRes} from 'webServices/pagination/pagination';

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

export type TAssignedTreesRes = PaginationRes<AssignedTree>;
export type TAssignedTreesPayload = {
  filters?: {signer: string; nonce: number};
  sort?: {signer: number; nonce: number};
};
export type TAssignedTreesAction = {
  type: string;
  payload: TAssignedTreesPayload;
};
