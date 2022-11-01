import {RelayProvider} from '@opengsn/provider';
import {TransactionReceipt} from 'web3-core';

import Web3 from 'services/Magic';
import {ContractType, NetworkConfig} from 'services/config';

export async function sendTransactionWithGSN(
  config: NetworkConfig,
  contractType: ContractType,
  web3: Web3,
  wallet: string,
  method: string,
  args: any[] = [],
  useGSN = true,
) {
  const contract = config.contracts[contractType];
  console.log(useGSN, 'useGSN <============== send transaction');
  console.log('1 - Is main net?', config.isMainnet);
  console.log(method, '<===== method');

  const _config = {
    auditorsCount: config.isMainnet ? 1 : 0,
    paymasterAddress: config.contracts.Paymaster.address,
    methodSuffix: '_v4',
    jsonStringifyRequest: true,
    performDryRunViewRelayCall: false,
    preferredRelays: [config.preferredRelays],
    relayLookupWindowBlocks: Number(config.relayLookupWindowBlocks),
    relayRegistrationLookupBlocks: Number(config.relayRegistrationLookupBlocks),
    pastEventsQueryMaxPageSize: Number(config.pastEventsQueryMaxPageSize),
    // preferredRelays: ['https://rinkeby-gsn-relayer.treejer.com'],
    // preferredRelays: ['https://ropsten-gsn-relayer.treejer.com/gsn1/getaddr'],
  };
  console.log(_config, '<== config sendTransactionWithGSN');

  if (!useGSN) {
    return sendTransactionWithoutGsn(config, contractType, web3, wallet, args, method);
  }

  const gsnProvider = await RelayProvider.newProvider({
    provider: web3.currentProvider as any,
    config: _config,
  }).init();

  console.log('2 - Relay provider created', config.isMainnet);

  // gsnProvider.addAccount(wallet);
  console.log('3 - Account linked to the relay provider', config.isMainnet);

  const gas = await web3.eth.estimateGas({from: wallet});
  console.log('Gas estimated', gas);

  const gasPrice = await web3.eth.getGasPrice();

  const web3GSN = new Web3(gsnProvider);
  const ethContract = new web3GSN.eth.Contract(contract.abi as any, contract.address);

  console.log('4 - Started sending the transaction', config.isMainnet);
  // Sends the transaction via the GSN
  console.log(method, 'Method', args, 'args', wallet, 'address');
  return ethContract.methods[method](...args).send({
    from: wallet,
    gas: 1e6,
    gasPrice,
    useGSN,
  }) as TransactionReceipt;
}

export async function sendTransactionWithoutGsn(
  config: NetworkConfig,
  contractType: ContractType,
  web3: Web3,
  wallet: string,
  args: any,
  method: string,
) {
  console.log('planting without GSN');
  const contract = config.contracts[contractType];
  const gasPrice = await web3.eth.getGasPrice();
  const ethContract = new web3.eth.Contract(contract.abi, contract.address);
  return ethContract.methods[method](...args).send({
    from: wallet,
    gas: 1e6,
    gasPrice,
  }) as TransactionReceipt;
}
