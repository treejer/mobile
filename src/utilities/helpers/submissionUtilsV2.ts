import {ContractType, treejerProtocol} from 'services/config';
import Web3 from 'web3';
const sigUtil = require('eth-sig-util');

import {NetworkConfig} from 'services/config';
import {TWeb3} from 'ranger-redux/modules/web3/web3';

export enum TreeFactoryMethods {
  PlantTree = 'plantTree',
  UpdateTree = 'updateTree',
  PlantMarketPlaceTree = 'plantMarketPlaceTree',
  PlantAssignedTree = 'plantAssignedTree',
}

export const methodParams = {
  [TreeFactoryMethods.PlantTree]: [
    {name: 'nonce', type: 'uint256'},
    {name: 'treeSpecs', type: 'string'},
    {name: 'birthDate', type: 'uint64'},
    {name: 'countryCode', type: 'uint16'},
  ],
  [TreeFactoryMethods.UpdateTree]: [
    {name: 'nonce', type: 'uint256'},
    {name: 'treeId', type: 'uint256'},
    {name: 'treeSpecs', type: 'string'},
  ],
  [TreeFactoryMethods.PlantAssignedTree]: [
    {name: 'nonce', type: 'uint256'},
    {name: 'treeId', type: 'uint256'},
    {name: 'treeSpecs', type: 'string'},
    {name: 'birthDate', type: 'uint64'},
    {name: 'countryCode', type: 'uint16'},
  ],
  [TreeFactoryMethods.PlantMarketPlaceTree]: [],
};

export type TTreeFactoryRequestParams = {
  nonce: number;
  treeId?: number;
  treeSpecs: string;
  birthDate?: number;
  countryCode?: number;
};

export type GenerateTreeFactorySignatureArgs = {
  magic: TWeb3['magic'];
  wallet: string;
  config: NetworkConfig;
  method: TreeFactoryMethods;
  requestParams: TTreeFactoryRequestParams;
};

export async function generateTreeFactorySignature({
  requestParams,
  method,
  config,
  wallet,
  magic,
}: GenerateTreeFactorySignatureArgs) {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = config.contracts[ContractType.TreeFactory];

      const msgParams = {
        types: {
          EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'},
          ],
          [method]: methodParams[method],
        },
        primaryType: method,
        domain: {
          name: treejerProtocol,
          version: '1',
          chainId: config.chainId,
          verifyingContract: contract.address,
        },
        message: requestParams,
      };

      console.log(msgParams, 'msgParams');

      const params = [wallet, msgParams];
      const getSignMethod = 'eth_signTypedData_v3';

      const signature = await magic.rpcProvider.request({
        method: getSignMethod,
        params,
      });

      // const recoveredAddress = sigUtil.recoverTypedSignature({
      //   data: msgParams,
      //   sig: signature,
      // });

      console.log(wallet, 'wallet is here');

      // console.log(
      //   recoveredAddress.toLocaleLowerCase() === wallet.toLocaleLowerCase() ? 'Signing success!' : 'Signing failed!',
      // );

      return resolve(signature);
    } catch (e: any) {
      return reject(e);
    }
  });
}
