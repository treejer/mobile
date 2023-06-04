import {PaginationRes} from 'webServices/pagination/pagination';

type PlantedTree = {
  _id: string;
  signer: string;
  nonce: number;
  treeSpecs: string;
  birthDate: number;
  countryCode: number;
  signature: string;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type TPlantedTreesRes = PaginationRes<PlantedTree>;

export type TPlantedTreesPayload = {
  filters?: {signer: string; nonce: number};
  sort?: {signer: number; nonce: number};
};

export type TPlantedTreesAction = {
  type: string;
  payload: TPlantedTreesPayload;
};
