import {TransactionReceipt} from 'web3-core';
import {Biconomy} from '@biconomy/mexa';

import Web3, {Magic} from 'services/Magic';
import {ContractType, NetworkConfig} from 'services/config';

export async function sendWeb3Transaction(
  magic: Magic,
  config: NetworkConfig,
  contractType: ContractType,
  web3: Web3,
  wallet: string,
  method: string,
  args: any[] = [],
  useBiconomy = true,
) {
  const contract = config.contracts[contractType];
  const apiKey = config.biconomyApiKey;
  console.log(apiKey, 'apiKey');
  console.log(useBiconomy, 'biconomy <============== send transaction');
  console.log('1 - Is main net?', config.isMainnet);
  console.log(method, '<===== method');

  const _config = {
    apiKey,
    contractAddress: config.biconomyAddress,
    debug: true,
    // auditorsCount: config.isMainnet ? 1 : 0,
    // methodSuffix: '_v4',
    // jsonStringifyRequest: true,

    // performDryRunViewRelayCall: false,
    // preferredRelays: [config.preferredRelays],
    // relayLookupWindowBlocks: Number(config.relayLookupWindowBlocks),
    // relayRegistrationLookupBlocks: Number(config.relayRegistrationLookupBlocks),
    // pastEventsQueryMaxPageSize: Number(config.pastEventsQueryMaxPageSize),

    // preferredRelays: ['https://rinkeby-gsn-relayer.treejer.com'],
    // preferredRelays: ['https://ropsten-gsn-relayer.treejer.com/gsn1/getaddr'],
  };

  if (!useBiconomy) {
    return sendTransactionWithoutBiconomy(config, contractType, web3, wallet, args, method);
  }

  // @ts-ignore
  const biconomy = new Biconomy(magic.rpcProvider, _config);

  console.log('2 - Relay provider created', config.isMainnet);

  // gsnProvider.addAccount(wallet);
  console.log('3 - Account linked to the relay provider', config.isMainnet);

  const gas = await web3.eth.estimateGas({from: wallet});

  console.log('Gas estimated', gas);

  const gasPrice = await web3.eth.getGasPrice();

  const web3Biconomy = new Web3(biconomy as any);

  const ethContract = new web3Biconomy.eth.Contract(contract.abi as any, contract.address);

  console.log('4 - Started sending the transaction', config.isMainnet);

  // * Sends the transaction via the biconomy

  console.log(method, 'Method', args, 'args', wallet, 'address');
  return ethContract.methods[method](...args).send('eth_sendTransaction', {
    from: wallet,
    // gas: 1e6,
    // gasPrice,
    signatureType: 'PERSONAL_SIGN',
    domainName: 'Powered by Biconomy',
  }) as TransactionReceipt;
}

export async function sendTransactionWithoutBiconomy(
  config: NetworkConfig,
  contractType: ContractType,
  web3: Web3,
  wallet: string,
  args: any,
  method: string,
) {
  console.log('planting without BICONOMY');

  console.log('2 - Relay provider created', config.isMainnet);

  console.log('3 - Account linked to the relay provider', config.isMainnet);

  const gas = await web3.eth.estimateGas({from: wallet});

  console.log('Gas estimated', gas);

  const gasPrice = await web3.eth.getGasPrice();

  console.log('4 - Started sending the transaction', config.isMainnet);

  const contract = config.contracts[contractType];
  const ethContract = new web3.eth.Contract(contract.abi, contract.address);
  return ethContract.methods[method](...args).send({
    from: wallet,
    gas: 1e6,
    gasPrice,
  }) as TransactionReceipt;
}
