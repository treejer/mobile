import AsyncStorage from '@react-native-community/async-storage';
import * as Crypto from 'expo-crypto';
import config from 'services/config';
import Web3 from 'web3';

export async function getTreejerApiAccessToken(privateKey: string, web3: Web3) {
  if (!privateKey) {
    return;
  }

  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, privateKey);
  const key = `ACCESS_TOKEN_${hash}`;

  const cachedToken = await AsyncStorage.getItem(key);

  if (cachedToken) {
    return cachedToken;
  }

  const response = await fetch(`${config.treejerApiUrl}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: config.treejerClientId,
      client_secret: config.treejerClientSecret,
      grant_type: 'social',
      provider: 'wallet',
      access_token: web3.eth.accounts.sign(config.publicKeyRecoveryMessage, privateKey).signature,
    }),
  });

  const value = await response.json();
  AsyncStorage.setItem(key, value.access_token);

  return value.access_token;
}
