import {PaginationRes} from 'webServices/pagination/pagination';
import {NotVerifiedTree, TreeStatus} from 'types';

export type PlantedTree = {
  _id: string;
  signer: string;
  nonce: number;
  treeSpecs: string;
  birthDate: number;
  countryCode: number;
  status: TreeStatus;
  createdAt: string;
  updatedAt: string;
};

export type TPlantedTreesRes = PaginationRes<NotVerifiedTree>;
export type TPlantedTreesPayload = {
  filters?: {signer: string; nonce: number};
  sort?: {signer: number; nonce: number};
};
export type TPlantedTreesAction = {
  type: string;
  payload: TPlantedTreesPayload;
};
