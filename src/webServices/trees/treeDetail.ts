export type TTreeDetailRes = {
  id: string;
  planter: {
    id: string;
  };
  funder: string;
  owner: string;
  countryCode: string;
  saleType: string;
  treeStatus: string;
  plantDate: string;
  birthDate: string;
  attribute: {
    attribute1: string;
    attribute2: string;
    attribute3: string;
    attribute4: string;
    attribute5: string;
    attribute6: string;
    attribute7: string;
    attribute8: string;
    generationType: string;
  };
  treeSpecsEntity: {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    imageFs?: string | null;
    imageHash?: string | null;
    symbolFs?: string | null;
    symbolHash?: string | null;
    animationUrl?: string | null;
    diameter?: number | null;
    latitude?: string | null;
    longitude?: string | null;
    attributes?: string | null;
    updates?: string | null;
    nursery?: string | null;
    locations?: string | null;
  };
  attributes: {
    trait_type: string;
    value: string;
  }[];
  lastUpdate: {
    id: String;
    updateStatus: number;
    updateSpecs: String;
    createdAt: number;
    updatedAt: number;
  };
  background_color: string;
  image: string;
  external_url: string;
  name: string;
};

export type TTreeDetailPayload = {
  id: string;
  inSubmission?: boolean;
};

export type TTreeDetailAction = {
  type: string;
  payload: TTreeDetailPayload;
};
