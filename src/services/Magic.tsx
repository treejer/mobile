import config from 'services/config';
import {Magic} from '@magic-sdk/react-native';
import Web3 from 'web3';

export function isMatic() {
  return config.magicNetwork === 'matic';
}

export const magic = new Magic(config.magicApiKey, {
  network: isMatic()
    ? {
        rpcUrl: config.web3Url,
        chainId: Number(config.chainId),
      }
    : 'rinkeby',
});

export default Web3;
