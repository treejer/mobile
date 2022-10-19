import {Magic} from '@magic-sdk/react-native';
import Web3 from 'web3';
import {BlockchainNetwork, NetworkConfig} from 'services/config';

export function isMatic(config: NetworkConfig) {
  return config.magicNetwork !== BlockchainNetwork.Goerli;
}

export function magicGenerator(config: NetworkConfig) {
  return new Magic(config.magicApiKey, {
    network: {
      rpcUrl: config.web3Url,
      chainId: Number(config.chainId),
    },
  });
}

export {Magic};

export default Web3;
