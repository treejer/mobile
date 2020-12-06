import Web3 from 'web3';
import {Account} from 'web3-core';

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
