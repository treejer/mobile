import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserSignRes} from 'services/types';
import config from 'services/config';

export async function userSign(signature: string, publicAddress: string, tokenKey: string): Promise<UserSignRes> {
  const response = await fetch(`${config.treejerApiUrl}/user/sign?publicAddress=${publicAddress}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({signature}),
  });

  const value = await response.json();

  if (value.loginToken && value.userId) {
    await AsyncStorage.setItem(tokenKey, value.loginToken);
    await AsyncStorage.setItem('USER_ID', value.userId);
    return Promise.resolve(value);
  } else {
    return Promise.reject(value);
  }
}
