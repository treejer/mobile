import AsyncStorage from '@react-native-async-storage/async-storage';
import Web3 from 'services/Magic';
import {getUserNonce} from 'utilities/helpers/userNonce';
import {userSign} from 'utilities/helpers/userSign';
import {UserSignRes} from 'services/types';
import {GetUserNonceAdditionalParams} from 'services/web3';

export async function getTreejerApiAccessToken(
  treejerApiUrl: string,
  web3: Web3,
  token: string,
  additionalParams: GetUserNonceAdditionalParams = {},
): Promise<UserSignRes> {
  let web3Accounts;
  await web3.eth.getAccounts((e, accounts) => {
    if (e) {
      console.log(e, 'e is here getAccounts eth');
    }
    web3Accounts = accounts;
    console.log(accounts, 'accounts is here');
  });
  if (!web3Accounts) {
    return Promise.reject(new Error('There is no web3 accounts'));
  }
  const wallet = web3Accounts[0];

  if (!wallet) {
    return Promise.reject(new Error('There is no wallet address'));
  }

  const key = `ACCESS_TOKEN_${wallet}`;

  const cachedToken = await AsyncStorage.getItem(key);
  console.log(cachedToken, 'cachedToken');

  const userId = await AsyncStorage.getItem('USER_ID');

  if (cachedToken && userId) {
    return Promise.resolve({
      userId,
      loginToken: cachedToken,
      wallet,
    });
  }

  try {
    const userNonceResult = await getUserNonce(treejerApiUrl, wallet, token, additionalParams);
    console.log(userNonceResult, 'userNonceResult is here<===');
    const signature = await web3.eth.sign(userNonceResult.message, wallet);
    console.log(signature, 'signature <===');

    try {
      const credentials = await userSign(treejerApiUrl, signature, wallet, key);
      console.log(credentials, 'credentials <===');
      return Promise.resolve({...credentials, wallet});
    } catch (e) {
      throw e;
    }
  } catch (e) {
    throw e;
  }
}
