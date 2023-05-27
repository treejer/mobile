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

export type TPlantedTreesRes = PlantedTree[];
