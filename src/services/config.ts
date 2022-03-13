/* eslint-disable no-process-env, @typescript-eslint/no-var-requires */
import {AbiDefinition} from 'apollo-link-ethereum';
import MaticLogo from '../../assets/images/matic-network-logo-vector.png';
import RinkebyLogo from '../../assets/images/rinkeby-logo.jpeg';
import {ImageURISource} from 'react-native';

export enum ContractType {
  TreeFactory = 'TreeFactory',
  Paymaster = 'Paymaster',
  Planter = 'Planter',
  PlanterFund = 'PlanterFund',
}

export interface ConfigContract {
  address: string;
  abi: AbiDefinition;
}

export interface StorageKeys {
  privateKey: string;
  magicToken: string;
  magicWalletAddress: string;
  user: string;
  onBoarding: string;
  locale: string;
  userId: string;
  offlineTrees: string;
  offlineUpdatedTrees: string;
  accessToken: string;
  useGSN: string;
  blockchainNetwork: string;
}

export enum BlockchainNetwork {
  Rinkeby = 'RINKEYBY',
  MaticTest = 'MATIC_TEST',
  MaticMain = 'MATIC_MAIN',
}

export interface NetworkConfig {
  contracts: {
    [ContractType.TreeFactory]: ConfigContract;
    [ContractType.Paymaster]: ConfigContract;
    [ContractType.Planter]: ConfigContract;
    [ContractType.PlanterFund]: ConfigContract;
  };
  networkId: number;
  isMainnet: boolean;
  web3Url: string;
  treejerApiUrl: string;
  thegraphUrl: string;
  ipfsPostURL: string;
  ipfsGetURL: string;
  mapboxToken: string;
  preferredRelays: string;
  relayLookupWindowBlocks: string;
  relayRegistrationLookupBlocks: string;
  pastEventsQueryMaxPageSize: string;
  learnMoreLink: string;
  avatarBaseUrl: string;
  magicApiKey: string;
  magicNetwork: BlockchainNetwork;
  chainId: string;
}

export interface Config {
  [BlockchainNetwork.Rinkeby]: NetworkConfig;
  [BlockchainNetwork.MaticTest]: NetworkConfig;
  [BlockchainNetwork.MaticMain]: NetworkConfig;
}

export function formatUrl(url: string) {
  return url?.replace(/\/$/, '');
}

const config: Config = {
  [BlockchainNetwork.MaticMain]: {
    contracts: {
      TreeFactory: {
        address: process.env.REACT_NATIVE_CONTRACT_TREE_FACTORY_ADDRESS,
        abi: require('../../matic-main/TreeFactory.json').abi,
      },
      Paymaster: {
        address: process.env.REACT_NATIVE_CONTRACT_PAYMASTER_ADDRESS,
        abi: require('../../matic-main/WhitelistPaymaster.json').abi,
      },
      Planter: {
        address: process.env.REACT_NATIVE_CONTRACT_PLANTER_ADDRESS,
        abi: require('../../matic-main/Planter.json').abi,
      },
      PlanterFund: {
        address: process.env.REACT_NATIVE_CONTRACT_PLANTER_FUND_ADDRESS,
        abi: require('../../matic-main/PlanterFund.json').abi,
      },
    },
    networkId: Number(process.env.REACT_NATIVE_WEB3_NETWORK_ID || 3),
    isMainnet: process.env.REACT_NATIVE_IS_MAINNET?.toString() === 'true',
    web3Url: process.env.REACT_NATIVE_WEB3_PROVIDER,
    treejerApiUrl: formatUrl(process.env.REACT_NATIVE_TREEJER_API_URL),
    thegraphUrl: formatUrl(process.env.REACT_NATIVE_THE_GRAPH_URL),
    ipfsPostURL: formatUrl(process.env.REACT_NATIVE_IPFS_POST_URL),
    ipfsGetURL: formatUrl(process.env.REACT_NATIVE_IPFS_GET_URL),
    mapboxToken: process.env.REACT_NATIVE_MAPBOX,
    preferredRelays: process.env.REACT_NATIVE_WEB3_PREFERREDRELAYS,
    relayLookupWindowBlocks: process.env.REACT_NATIVE_WEB3_RELAY_LOOKUP_WINDOW_BLOCKS,
    relayRegistrationLookupBlocks: process.env.REACT_NATIVE_WEB3_RELAY_REGISTRATION_LOOKUP_BLOCKS,
    pastEventsQueryMaxPageSize: process.env.REACT_NATIVE_WEB3_PAST_EVENTS_QUERY_MAX_PAGE_SIZE,
    learnMoreLink: process.env.REACT_NATIVE_LEARN_MORE_URL,
    avatarBaseUrl: process.env.REACT_NATIVE_AVATAR_BASE_URL,
    magicApiKey: process.env.REACT_NATIVE_MAGIC_API_KEY,
    magicNetwork: BlockchainNetwork.MaticMain,
    chainId: process.env.REACT_NATIVE_CHAIN_ID,
  },
  [BlockchainNetwork.MaticTest]: {
    contracts: {
      TreeFactory: {
        address: '0xD6129f08B951C3C2eDb263D6672D117d76814c0D',
        abi: require('../../matic-test/TreeFactory.json').abi,
      },
      Paymaster: {
        address: '0x1B8931d7f0e2281685fa4852fA4812518b9a0FC6',
        abi: require('../../matic-test/WhitelistPaymaster.json').abi,
      },
      Planter: {
        address: '0x3DB4b740a26ED6302Ef353F83DD4E9C61DF304Df',
        abi: require('../../matic-test/Planter.json').abi,
      },
      PlanterFund: {
        address: '0x3245EF0b886526d304C78d80E8FB13c7043159f5',
        abi: require('../../matic-test/PlanterFund.json').abi,
      },
    },
    networkId: 137,
    isMainnet: true,
    web3Url: 'https://polygon-mainnet.infura.io/v3/2badebd712994036b278085cad3c4d37',
    treejerApiUrl: formatUrl('https://api.treejer.com'),
    thegraphUrl: formatUrl('https://api.thegraph.com/subgraphs/name/treejer/treejer-subgraph-mprivate'),
    ipfsPostURL: 'https://ipfs.treejer.com/api/v0/add',
    ipfsGetURL: 'https://ipfs.treejer.com/ipfs/',
    mapboxToken: 'sk.eyJ1IjoiaGl0cmVlamVyIiwiYSI6ImNsMGhjYWo2NzAxYjUzZG8zaTYzNW01dWMifQ.9MuQBGYe-cXeabFWSnAERg',
    preferredRelays: 'https://matic-gsn.treejer.com/gsn1',
    relayLookupWindowBlocks: '990',
    relayRegistrationLookupBlocks: '990',
    pastEventsQueryMaxPageSize: '990',
    learnMoreLink:
      'https://discuss.treejer.com/question/what-is-an-ethereum-wallet-and-which-one-should-i-use-5f1253c015feeb1c24b607fb',
    avatarBaseUrl: 'https://avatars.treejer.com',
    magicApiKey: 'pk_live_56F9FBD7B77152A1',
    magicNetwork: BlockchainNetwork.MaticTest,
    chainId: '',
  },
  [BlockchainNetwork.Rinkeby]: {
    contracts: {
      TreeFactory: {
        address: '0x78AAb10F8964B08D7367E893f278d929b44b8bDC',
        abi: require('../../rinkeby/TreeFactory.json').abi,
      },
      Paymaster: {
        address: '0x4F28FdFA825Cc1aaAE09A1c053C965A298CE831E',
        abi: require('../../rinkeby/WhitelistPaymaster.json').abi,
      },
      Planter: {
        address: '0x9E5a3BC30D4b6313553AE29296363Eb671CDd1f5',
        abi: require('../../rinkeby/Planter.json').abi,
      },
      PlanterFund: {
        address: '0x5656ac0a3AcDfEEea76c73D1FcE9F9D6a87C595e',
        abi: require('../../rinkeby/PlanterFund.json').abi,
      },
    },
    networkId: 3,
    isMainnet: false,
    web3Url: 'https://rinkeby.infura.io/v3/8ab61f6564fc4849b479572d804dc739',
    treejerApiUrl: formatUrl('https://lbapi.treejer.com/'),
    thegraphUrl: formatUrl('https://api.thegraph.com/subgraphs/name/treejer/treejer-subgraph-rinkeby'),
    ipfsPostURL: formatUrl('https://ipfs.treejer.com/api/v0/add'),
    ipfsGetURL: formatUrl('https://ipfs.treejer.com/ipfs/'),
    mapboxToken: 'sk.eyJ1IjoiaGl0cmVlamVyIiwiYSI6ImNsMGhjYWo2NzAxYjUzZG8zaTYzNW01dWMifQ.9MuQBGYe-cXeabFWSnAERg',
    preferredRelays: 'https://rinkeby-gsn-relayer.treejer.com/gsn1',
    relayLookupWindowBlocks: '1e5',
    relayRegistrationLookupBlocks: '1e5',
    pastEventsQueryMaxPageSize: '2e4',
    learnMoreLink: formatUrl(
      'https://discuss.treejer.com/question/what-is-an-ethereum-wallet-and-which-one-should-i-use-5f1253c015feeb1c24b607fb',
    ),
    avatarBaseUrl: 'https://avatars.treejer.com',
    magicApiKey: 'pk_live_75FA0B2BD75F1EF5',
    magicNetwork: BlockchainNetwork.Rinkeby,
    chainId: '',
  },
};

export const storageKeys: StorageKeys = {
  privateKey: '__TREEJER_PRIVATE_KEY',
  magicToken: '__TREEJER_MAGIC_TOKEN',
  magicWalletAddress: '__TREEJER_MAGIC_WALLET_ADDRESS',
  user: '__TREEJER_CURRENT_USER',
  onBoarding: '__TREEJER_ONBOARDING',
  locale: '__TREEJER_LOCALE',
  userId: '__TREEJER_USER_ID',
  offlineTrees: '__TREEJER_OFFLINE_TREES',
  offlineUpdatedTrees: '__TREEJER_OFFLINE_UPDATED_TREES',
  accessToken: '__TREEJER_ACCESS_TOKEN',
  useGSN: '__TREEJER_USE_GSN',
  blockchainNetwork: '__TREEJER_BLOCKCHAIN_NETWORK',
};

export const rangerUrl = 'https://ranger.treejer.com';
export const defaultLocale = 'en';

export interface NetworkInfo {
  title: string;
  network: BlockchainNetwork;
  details: string;
  logo: ImageURISource;
}

export type Networks = {
  [key in BlockchainNetwork]: NetworkInfo;
};

export const networks: Networks = {
  [BlockchainNetwork.Rinkeby]: {
    title: 'Rinkeby',
    network: BlockchainNetwork.Rinkeby,
    details: 'This network is development purpose only on ethereum',
    logo: RinkebyLogo,
  },
  [BlockchainNetwork.MaticTest]: {
    title: 'Matic TEST',
    network: BlockchainNetwork.MaticTest,
    details: 'This network is development purpose only',
    logo: MaticLogo,
  },
  [BlockchainNetwork.MaticMain]: {
    title: 'Matic',
    network: BlockchainNetwork.MaticMain,
    details:
      'This is the main network, by switching all your transaction would be send on the treejer main blockchain network!',
    logo: MaticLogo,
  },
};

export default config;
