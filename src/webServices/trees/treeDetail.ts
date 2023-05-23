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
    id: string;
    name: string;
    description: string;
    externalUrl: string;
    imageFs: string;
    imageHash: string;
    symbolFs: string;
    symbolHash: string;
    animationUrl: string;
    diameter: string;
    latitude: string;
    longitude: string;
    attributes: string;
  };
  attributes: {
    trait_type: string;
    value: string;
  }[];
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
