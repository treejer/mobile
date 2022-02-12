import {RelayProvider} from '@opengsn/provider';
import config from 'services/config';
import Web3 from 'web3';
import {Account, TransactionReceipt} from 'web3-core';

type Contracts = typeof config['contracts'];

export async function sendTransaction(web3: Web3, tx: any, contractAddress: string, {address, privateKey}: Account) {
  const networkId = await web3.eth.net.getId();
  console.log('1 - Got Network Id', networkId);

  const gas = await tx.estimateGas({from: address});
  console.log('2 - Gas estimated', gas);

  const gasPrice = await web3.eth.getGasPrice();
  console.log('3 - Gas price ready', gasPrice);

  const data = tx.encodeABI();
  console.log('4 - ABI encoded');

  const nonce = await web3.eth.getTransactionCount(address);
  console.log('5 - Nonce', nonce);

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: networkId,
    },
    privateKey,
  );
  console.log('6 - Transaction signed');

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('7 - Transaction sent');

  return receipt;
}

console.log(config.relayLookupWindowBlocks, 'alsdkjf');

export async function sendTransactionWithGSNTorus(
  web3: Web3,
  wallet: Account,
  contract: Contracts[keyof Contracts],
  method: string,
  args: any[] = [],
) {
  console.log('1 - Is main net?', config.isMainnet);

  const _config = {
    auditorsCount: config.isMainnet ? 1 : 0,
    paymasterAddress: config.contracts.Paymaster.address,
    methodSuffix: '_v4',
    jsonStringifyRequest: true,
    preferredRelays: [config.preferredRelays],
    relayLookupWindowBlocks: Number(config.relayLookupWindowBlocks),
    relayRegistrationLookupBlocks: Number(config.relayRegistrationLookupBlocks),
    pastEventsQueryMaxPageSize: Number(config.pastEventsQueryMaxPageSize),
    // preferredRelays: ['https://rinkeby-gsn-relayer.treejer.com'],
    // preferredRelays: ['https://ropsten-gsn-relayer.treejer.com/gsn1/getaddr'],
  };
  console.log(_config, '<== config sendTransactionWithGSN');

  const gsnProvider = await RelayProvider.newProvider({
    provider: web3.currentProvider as any,
    config: _config,
  }).init();
  console.log('2 - Relay provider created', config.isMainnet);

  gsnProvider.addAccount(wallet.privateKey);
  console.log('3 - Account linked to the relay provider', config.isMainnet);

  const web3GSN = new Web3(gsnProvider);
  const ethContract = new web3GSN.eth.Contract(contract.abi, contract.address);

  console.log('4 - Started sending the transaction', config.isMainnet);
  // Sends the transaction via the GSN
  console.log(method, 'Method', args, 'args', wallet.address, 'address');
  return ethContract.methods[method](...args).send({
    from: wallet.address,
    gas: 1e6,
    useGSN: true,
  }) as TransactionReceipt;
}

export async function sendTransactionWithGSN(
  web3: Web3,
  wallet: string,
  contract: Contracts[keyof Contracts],
  method: string,
  args: any[] = [],
) {
  console.log('1 - Is main net?', config.isMainnet);

  const _config = {
    auditorsCount: config.isMainnet ? 1 : 0,
    paymasterAddress: config.contracts.Paymaster.address,
    methodSuffix: '_v4',
    jsonStringifyRequest: true,
    preferredRelays: [config.preferredRelays],
    relayLookupWindowBlocks: Number(config.relayLookupWindowBlocks),
    relayRegistrationLookupBlocks: Number(config.relayRegistrationLookupBlocks),
    pastEventsQueryMaxPageSize: Number(config.pastEventsQueryMaxPageSize),
    // preferredRelays: ['https://rinkeby-gsn-relayer.treejer.com'],
    // preferredRelays: ['https://ropsten-gsn-relayer.treejer.com/gsn1/getaddr'],
  };
  console.log(_config, '<== config sendTransactionWithGSN');

  const gsnProvider = await RelayProvider.newProvider({
    provider: web3.currentProvider as any,
    config: _config,
  }).init();
  console.log('2 - Relay provider created', config.isMainnet);

  gsnProvider.addAccount(wallet.privateKey);
  console.log('3 - Account linked to the relay provider', config.isMainnet);

  const web3GSN = new Web3(gsnProvider);
  const ethContract = new web3GSN.eth.Contract(contract.abi, contract.address);

  console.log('4 - Started sending the transaction', config.isMainnet);
  // Sends the transaction via the GSN
  console.log(method, 'Method', args, 'args', wallet.address, 'address');
  return ethContract.methods[method](...args).send({
    from: wallet.address,
    gas: 1e6,
    useGSN: true,
  }) as TransactionReceipt;
}

export async function sendTransactionWithWallet(web3: Web3, tx: any, contractAddress: string, {address}: Account) {
  console.log(web3.givenProvider, '====> web3 <====');
  console.log(tx, '====> tx <====');
  console.log(contractAddress, '====> contractAddress <====');
  console.log(address, '====> address <====');
  try {
    const networkId = await web3.eth.net.getId();
    console.log('1 - Got Network Id', networkId);

    const gas = await tx.estimateGas({from: address});
    console.log('2 - Gas estimated', gas);

    const gasPrice = await web3.eth.getGasPrice();
    console.log('3 - Gas price ready', gasPrice);

    const data = tx.encodeABI();
    console.log('4 - ABI encoded', data);

    const nonce = await web3.eth.getTransactionCount(address);
    console.log('5 - Nonce', nonce);

    const receipt = await web3.eth.sendTransaction({
      from: address,
      to: contractAddress,
      data,
      gas,
      gasPrice,
      nonce,
      chainId: networkId,
    });
    return receipt;
  } catch (e) {
    console.log(e, '====> e <====');
    return e.message;
  }
}

export async function sendTransactionWithWalletGSN(
  web3: Web3,
  wallet: Account,
  contract: Contracts[keyof Contracts],
  method: string,
  args: any[] = [],
) {
  console.log('1 - Is main net?', config.isMainnet);

  const gsnProvider = await RelayProvider.newProvider({
    provider: web3.currentProvider as any,
    config: {
      auditorsCount: config.isMainnet ? 1 : 0,
      paymasterAddress: config.contracts.Paymaster.address,
      methodSuffix: '_v4',
      jsonStringifyRequest: true,
      // preferredRelays: ['https://ropsten-gsn-relayer.treejer.com/gsn1/getaddr'],
    },
  }).init();
  console.log('2 - Relay provider created', config.isMainnet);

  // gsnProvider.addAccount(wallet.privateKey);
  // console.log('3 - Account linked to the relay provider', config.isMainnet);

  const web3GSN = new Web3(gsnProvider);
  const ethContract = new web3GSN.eth.Contract(contract.abi, contract.address);

  console.log('3 - Started sending the transaction', config.isMainnet);
  return ethContract.methods[method](...args).send({
    from: wallet.address,
    gas: 1e6,
    useGSN: true,
  }) as TransactionReceipt;
  // Sends the transaction via the GSN
}
