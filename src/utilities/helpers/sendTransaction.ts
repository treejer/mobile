import {TransactionReceipt} from 'web3-core';

import Web3, {Magic} from 'services/Magic';
import {ContractType, NetworkConfig} from 'services/config';
import {transactionBiconomy} from 'services/Biconomy';

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

  if (!useBiconomy) {
    return sendTransactionWithoutBiconomy(config, contractType, web3, wallet, args, method);
  }

  const biconomy = await transactionBiconomy({apiKey, magic});
  const web3Biconomy = new Web3(biconomy as any);
  const ethContract = new web3Biconomy.eth.Contract(contract.abi as any, contract.address);

  console.log('2 - Relay provider created', config.isMainnet);

  return ethContract.methods[method](...args).send('eth_sendTransaction', {
    from: wallet,
    signatureType: 'PERSONAL_SIGN',
    domainName: 'Powered by Biconomy',
  });
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
