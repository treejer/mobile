import {Magic} from '@magic-sdk/react-native';
import Web3 from 'web3';
import {BlockchainNetwork, NetworkConfig} from 'services/config';

export function isMatic(config: NetworkConfig) {
  return config.magicNetwork !== BlockchainNetwork.Rinkeby;
}

export function magicGenerator(config: NetworkConfig) {
  return new Magic(config.magicApiKey, {
    network: isMatic(config)
      ? {
          rpcUrl: config.web3Url,
          chainId: Number(config.chainId),
        }
      : 'rinkeby',
  });
}

export {Magic};

export default Web3;
