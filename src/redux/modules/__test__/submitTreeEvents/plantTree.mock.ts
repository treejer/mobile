import configs, {defaultNetwork} from 'services/config';

export const plantTreeRes = {
  _id: 'string',
  signer: 'string',
  nonce: 0,
  treeSpecs: 'string',
  birthDate: 0,
  countryCode: 0,
  signature: 'string',
  status: 0,
  createdAt: '2023-05-15T19:15:26.107Z',
  updatedAt: '2023-05-15T19:15:26.107Z',
};

export const mainNetConfig = configs[defaultNetwork];
export const testNetConfig = {
  ...configs[defaultNetwork],
  isMainnet: false,
};
