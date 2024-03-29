/* eslint-disable no-process-env, @typescript-eslint/no-var-requires */
import {AbiDefinition} from 'apollo-link-ethereum';
import {ImageURISource} from 'react-native';

import {MaticLogo, GoerliLogo} from '../../assets/images';

console.log(process.env);

export enum ContractType {
  TreeFactory = 'TreeFactory',
  Paymaster = 'Paymaster',
  Planter = 'Planter',
  PlanterFund = 'PlanterFund',
  DAI = 'Dai',
  MarketPlace = 'MarketPlace',
}

export interface ConfigContract {
  address: string;
  abi: AbiDefinition['abi'];
}

export interface StorageKeys {
  privateKey: string;
  magicToken: string;
  magicWalletAddress: string;
  user: string;
  userId: string;
  offlineTrees: string;
  offlineUpdatedTrees: string;
  accessToken: string;
  blockchainNetwork: string;
  treeUpdateInterval: string;
}

export enum BlockchainNetwork {
  Goerli = 'GOERLI',
  MaticTest = 'MATIC_TEST',
  MaticMain = 'MATIC_MAIN',
}

export interface NetworkConfig {
  contracts: {
    [key in ContractType]: ConfigContract;
  };
  networkId: number;
  isMainnet: boolean;
  web3Url: string;
  treejerApiUrl: string;
  thegraphUrl: string;
  ipfsPostURL: string;
  ipfsGetURL: string;
  preferredRelays: string;
  relayLookupWindowBlocks: string;
  relayRegistrationLookupBlocks: string;
  pastEventsQueryMaxPageSize: string;
  learnMoreLink: string;
  avatarBaseUrl: string;
  magicApiKey: string;
  biconomyApiKey: string;
  biconomyAddress: string;
  magicNetwork: BlockchainNetwork;
  chainId: string;
  explorerUrl: string;
}

export interface Config {
  [BlockchainNetwork.MaticTest]: NetworkConfig;
  [BlockchainNetwork.MaticMain]: NetworkConfig;
  [BlockchainNetwork.Goerli]: NetworkConfig;
}

export function formatUrl(url?: string) {
  return url ? url?.replace(/\/$/, '') : '';
}

export const isProd = process.env.NODE_ENV?.toLowerCase() === 'production';

const config: Config = {
  [BlockchainNetwork.MaticMain]: {
    contracts: {
      TreeFactory: {
        address: process.env.REACT_NATIVE_MATIC_MAIN_CONTRACT_TREE_FACTORY_ADDRESS || '',
        abi: require('../abis/TreeFactory.json'),
      },
      Paymaster: {
        address: process.env.REACT_NATIVE_MATIC_MAIN_CONTRACT_PAYMASTER_ADDRESS || '',
        abi: require('../abis/WhitelistPaymaster.json'),
      },
      Planter: {
        address: process.env.REACT_NATIVE_MATIC_MAIN_CONTRACT_PLANTER_ADDRESS || '',
        abi: require('../abis/Planter.json'),
      },
      PlanterFund: {
        address: process.env.REACT_NATIVE_MATIC_MAIN_CONTRACT_PLANTER_FUND_ADDRESS || '',
        abi: require('../abis/PlanterFund.json'),
      },
      Dai: {
        address: process.env.REACT_NATIVE_MATIC_MAIN_DAI_TOKEN_ADDRESS || '',
        abi: require('../abis/Dai.json'),
      },
      MarketPlace: {
        address: process.env.REACT_NATIVE_MATIC_MAIN_CONTRACT_MARKET_PLACE_ADDRESS || '',
        abi: require('../abis/MarketPlace.json'),
      },
    },
    biconomyAddress: process.env.REACT_NATIVE_MATIC_MAIN_CONTRACT_BICONOMY_ADDRESS || '',
    networkId: Number(process.env.REACT_NATIVE_MATIC_MAIN_WEB3_NETWORK_ID || 3),
    isMainnet: true,
    web3Url: process.env.REACT_NATIVE_MATIC_MAIN_WEB3_PROVIDER || '',
    treejerApiUrl: formatUrl(process.env.REACT_NATIVE_MATIC_MAIN_TREEJER_API_URL),
    thegraphUrl: formatUrl(process.env.REACT_NATIVE_MATIC_MAIN_THE_GRAPH_URL),
    ipfsPostURL: formatUrl(process.env.REACT_NATIVE_MATIC_MAIN_IPFS_POST_URL),
    ipfsGetURL: formatUrl(process.env.REACT_NATIVE_MATIC_MAIN_IPFS_GET_URL),
    preferredRelays: process.env.REACT_NATIVE_MATIC_MAIN_WEB3_PREFERREDRELAYS || '',
    relayLookupWindowBlocks: process.env.REACT_NATIVE_MATIC_MAIN_WEB3_RELAY_LOOKUP_WINDOW_BLOCKS || '',
    relayRegistrationLookupBlocks: process.env.REACT_NATIVE_MATIC_MAIN_WEB3_RELAY_REGISTRATION_LOOKUP_BLOCKS || '',
    pastEventsQueryMaxPageSize: process.env.REACT_NATIVE_MATIC_MAIN_WEB3_PAST_EVENTS_QUERY_MAX_PAGE_SIZE || '',
    learnMoreLink: process.env.REACT_NATIVE_MATIC_MAIN_LEARN_MORE_URL || '',
    avatarBaseUrl: process.env.REACT_NATIVE_MATIC_MAIN_AVATAR_BASE_URL || '',
    biconomyApiKey: process.env.REACT_NATIVE_MATIC_MAIN_BICONOMY_API_KEY || '',
    magicApiKey: process.env.REACT_NATIVE_MATIC_MAIN_MAGIC_API_KEY || '',
    magicNetwork: BlockchainNetwork.MaticMain,
    chainId: process.env.REACT_NATIVE_MATIC_MAIN_CHAIN_ID || '',
    explorerUrl: process.env.REACT_NATIVE_MATIC_MAIN_EXPLORER_URL || '',
  },
  [BlockchainNetwork.MaticTest]: {
    contracts: {
      TreeFactory: {
        address: process.env.REACT_NATIVE_MATIC_TEST_CONTRACT_TREE_FACTORY_ADDRESS || '',
        abi: require('../abis/TreeFactory.json'),
      },
      Paymaster: {
        address: process.env.REACT_NATIVE_MATIC_TEST_CONTRACT_PAYMASTER_ADDRESS || '',
        abi: require('../abis/WhitelistPaymaster.json'),
      },
      Planter: {
        address: process.env.REACT_NATIVE_MATIC_TEST_CONTRACT_PLANTER_ADDRESS || '',
        abi: require('../abis/Planter.json'),
      },
      PlanterFund: {
        address: process.env.REACT_NATIVE_MATIC_TEST_CONTRACT_PLANTER_FUND_ADDRESS || '',
        abi: require('../abis/PlanterFund.json'),
      },
      Dai: {
        address: process.env.REACT_NATIVE_MATIC_TEST_DAI_TOKEN_ADDRESS || '',
        abi: require('../abis/Dai.json'),
      },
      MarketPlace: {
        address: process.env.REACT_NATIVE_MATIC_TEST_CONTRACT_MARKET_PLACE_ADDRESS || '',
        abi: require('../abis/MarketPlace.json'),
      },
    },
    biconomyAddress: process.env.REACT_NATIVE_MATIC_TEST_CONTRACT_BICONOMY_ADDRESS || '',
    networkId: Number(process.env.REACT_NATIVE_MATIC_TEST_WEB3_NETWORK_ID || 3),
    isMainnet: true,
    web3Url: process.env.REACT_NATIVE_MATIC_TEST_WEB3_PROVIDER || '',
    treejerApiUrl: formatUrl(process.env.REACT_NATIVE_MATIC_TEST_TREEJER_API_URL),
    thegraphUrl: formatUrl(process.env.REACT_NATIVE_MATIC_TEST_THE_GRAPH_URL),
    ipfsPostURL: formatUrl(process.env.REACT_NATIVE_MATIC_TEST_IPFS_POST_URL),
    ipfsGetURL: formatUrl(process.env.REACT_NATIVE_MATIC_TEST_IPFS_GET_URL),
    preferredRelays: process.env.REACT_NATIVE_MATIC_TEST_WEB3_PREFERREDRELAYS || '',
    relayLookupWindowBlocks: process.env.REACT_NATIVE_MATIC_TEST_WEB3_RELAY_LOOKUP_WINDOW_BLOCKS || '',
    relayRegistrationLookupBlocks: process.env.REACT_NATIVE_MATIC_TEST_WEB3_RELAY_REGISTRATION_LOOKUP_BLOCKS || '',
    pastEventsQueryMaxPageSize: process.env.REACT_NATIVE_MATIC_TEST_WEB3_PAST_EVENTS_QUERY_MAX_PAGE_SIZE || '',
    learnMoreLink: process.env.REACT_NATIVE_MATIC_TEST_LEARN_MORE_URL || '',
    avatarBaseUrl: process.env.REACT_NATIVE_MATIC_TEST_AVATAR_BASE_URL || '',
    biconomyApiKey: process.env.REACT_NATIVE_MATIC_TEST_BICONOMY_API_KEY || '',
    magicApiKey: process.env.REACT_NATIVE_MATIC_TEST_MAGIC_API_KEY || '',
    magicNetwork: BlockchainNetwork.MaticTest,
    chainId: process.env.REACT_NATIVE_MATIC_TEST_CHAIN_ID || '',
    explorerUrl: process.env.REACT_NATIVE_MATIC_TEST_EXPLORER_URL || '',
  },
  [BlockchainNetwork.Goerli]: {
    contracts: {
      TreeFactory: {
        address: process.env.REACT_NATIVE_GOERLI_CONTRACT_TREE_FACTORY_ADDRESS || '',
        abi: require('../abis/TreeFactory.json'),
      },
      Paymaster: {
        address: process.env.REACT_NATIVE_GOERLI_CONTRACT_PAYMASTER_ADDRESS || '',
        abi: require('../abis/WhitelistPaymaster.json'),
      },
      Planter: {
        address: process.env.REACT_NATIVE_GOERLI_CONTRACT_PLANTER_ADDRESS || '',
        abi: require('../abis/Planter.json'),
      },
      PlanterFund: {
        address: process.env.REACT_NATIVE_GOERLI_CONTRACT_PLANTER_FUND_ADDRESS || '',
        abi: require('../abis/PlanterFund.json'),
      },
      Dai: {
        address: process.env.REACT_NATIVE_GOERLI_CONTRACT_DAI_TOKEN_ADDRESS || '',
        abi: require('../abis/Dai.json'),
      },
      MarketPlace: {
        address: process.env.REACT_NATIVE_GOERLI_CONTRACT_MARKET_PLACE_ADDRESS || '',
        abi: require('../abis/MarketPlace.json'),
      },
    },
    biconomyAddress: process.env.REACT_NATIVE_GOERLI_CONTRACT_BICONOMY_ADDRESS || '',
    networkId: Number(process.env.REACT_NATIVE_GOERLI_WEB3_NETWORK_ID || 3),
    isMainnet: false,
    web3Url: process.env.REACT_NATIVE_GOERLI_WEB3_PROVIDER || '',
    // treejerApiUrl: formatUrl(
    //   isProd
    //     ? process.env.REACT_NATIVE_GOERLI_TREEJER_API_URL
    //     : Platform.select({
    //         android: 'http://10.0.2.2:3000/',
    //         default: 'http://localhost:3000/',
    //       }),
    // ),
    treejerApiUrl: formatUrl(process.env.REACT_NATIVE_GOERLI_TREEJER_API_URL),
    thegraphUrl: formatUrl(process.env.REACT_NATIVE_GOERLI_THE_GRAPH_URL),
    ipfsPostURL: formatUrl(process.env.REACT_NATIVE_GOERLI_IPFS_POST_URL),
    ipfsGetURL: formatUrl(process.env.REACT_NATIVE_GOERLI_IPFS_GET_URL),
    preferredRelays: process.env.REACT_NATIVE_GOERLI_WEB3_PREFERREDRELAYS || '',
    relayLookupWindowBlocks: process.env.REACT_NATIVE_GOERLI_WEB3_RELAY_LOOKUP_WINDOW_BLOCKS || '',
    relayRegistrationLookupBlocks: process.env.REACT_NATIVE_GOERLI_WEB3_RELAY_REGISTRATION_LOOKUP_BLOCKS || '',
    pastEventsQueryMaxPageSize: process.env.REACT_NATIVE_GOERLI_WEB3_PAST_EVENTS_QUERY_MAX_PAGE_SIZE || '',
    learnMoreLink: process.env.REACT_NATIVE_GOERLI_LEARN_MORE_URL || '',
    avatarBaseUrl: process.env.REACT_NATIVE_GOERLI_AVATAR_BASE_URL || '',
    biconomyApiKey: process.env.REACT_NATIVE_GOERLI_BICONOMY_API_KEY || '',
    magicApiKey: process.env.REACT_NATIVE_GOERLI_MAGIC_API_KEY || '',
    magicNetwork: BlockchainNetwork.Goerli,
    chainId: process.env.REACT_NATIVE_GOERLI_CHAIN_ID || '',
    explorerUrl: process.env.REACT_NATIVE_GOERLI_EXPLORER_URL || '',
  },
};

export const storageKeys: StorageKeys = {
  privateKey: '__TREEJER_PRIVATE_KEY',
  magicToken: '__TREEJER_MAGIC_TOKEN',
  magicWalletAddress: '__TREEJER_MAGIC_WALLET_ADDRESS',
  user: '__TREEJER_CURRENT_USER',
  userId: '__TREEJER_USER_ID',
  offlineTrees: '__TREEJER_OFFLINE_TREES',
  offlineUpdatedTrees: '__TREEJER_OFFLINE_UPDATED_TREES',
  accessToken: '__TREEJER_ACCESS_TOKEN',
  blockchainNetwork: '__TREEJER_BLOCKCHAIN_NETWORK',
  treeUpdateInterval: '__TREEJER_TREE_UPDATE_INTERVAL',
};

export const rangerUrl = 'https://ranger.treejer.com';
export const rangerDevUrl = 'https://ranger-dev.treejer.com';
export const defaultLocale = 'en';
export const defaultNetwork = BlockchainNetwork.MaticMain;
export const googlePlayUrl = 'https://play.google.com/store/apps/details?id=com.treejer.ranger';

export const mapboxPublicToken = process.env.REACT_NATIVE_PUBLIC_MAPBOX_TOKEN || '';
export const mapboxPrivateToken = process.env.REACT_NATIVE_PRIVATE_MAPBOX_TOKEN || '';

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
  [BlockchainNetwork.Goerli]: {
    title: 'Goerli',
    network: BlockchainNetwork.Goerli,
    details: 'This is development purpose only on ethereum',
    logo: GoerliLogo,
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

export const debugFetch = false;
export const reduxLogger = false;

export const supportLinks = {
  chatOnline: process.env.REACT_NATIVE_CHAT_ONLINE_LINK || '',
  discord: process.env.REACT_NATIVE_DISCORD_LINK || '',
  twitter: process.env.REACT_NATIVE_TWITTER_LINK || '',
  discussion: process.env.REACT_NATIVE_DISCUSSION_LINK || '',
};

export default config;

export const maxDistanceInKiloMeters = 200;
export const maxDistanceInMeters = 100;

export const offlineMapName = () => `OfflineMap-${Date.now()}`;
export const offlineSubmittingMapName = () => `OfflineSubmittingMap-${Date.now()}`;
