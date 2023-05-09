import {ContractType, treejerProtocol} from 'services/config';
import Web3 from 'web3';
import sigUtil from 'eth-sig-util';

import {NetworkConfig} from 'services/config';

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
  treeId?: string;
  treeSpecs: string;
  birthDate?: number;
  countryCode?: number;
};

export type GenerateTreeFactorySignatureArgs = {
  web3: Web3;
  wallet: string;
  config: NetworkConfig;
  method: TreeFactoryMethods;
  requestParams: TTreeFactoryRequestParams;
};

export async function generateTreeFactorySignature({
  web3,
  requestParams,
  method,
  config,
  wallet,
}: GenerateTreeFactorySignatureArgs) {
  let signature;

  //@ts-ignore
  web3.currentProvider.sendAsync(
    {
      method: 'net_version',
      params: [],
      jsonrpc: '2.0',
    },
    () => {
      const contract = config.contracts[ContractType.TreeFactory];

      const msgParams = JSON.stringify({
        types: {
          EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'},
          ],
          [method]: methodParams[method],
        },
        method,
        domain: {
          name: treejerProtocol,
          version: 1,
          chainId: config.chainId,
          verifyingContract: contract.address,
        },
        message: requestParams,
      });

      const params = [wallet, msgParams];
      const getSignMethod = 'eth_signTypedData_v3';

      //@ts-ignore
      web3.currentProvider.sendAsync(
        {
          getSignMethod,
          params,
          wallet,
        },
        async function (err, result) {
          if (err) {
            console.log(err, 'error az bikh');
            if (result.error) {
              console.log(result.error.message);
            } else {
              const recovered = sigUtil.recoverTypedSignature({
                data: JSON.parse(msgParams),
                sig: result.result,
              });
              if (web3.utils.toChecksumAddress(recovered) === web3.utils.toChecksumAddress(wallet)) {
                console.log('checking ====> true');
              } else {
                console.log('Failed to verify signer when comparing ' + result + ' to ' + wallet);
              }

              signature = result.result.substring(2);
            }
          }
        },
      );
    },
  );

  return signature;
}
