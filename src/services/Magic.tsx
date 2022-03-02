import config from 'services/config';
import {EthNetworkConfiguration, Magic} from '@magic-sdk/react-native';
import Web3 from 'web3';

export const magic = new Magic(config.magicApiKey, {
  network: config.magicNetwork as EthNetworkConfiguration,
});

export default Web3;
