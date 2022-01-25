// import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../services/config';

export async function getUserNonce(publicAddress: string) {
  try {
    const response = await fetch(`${config.treejerApiUrl}/user/nonce?publicAddress=${publicAddress}`, {
      method: 'GET',
    });

    const {message, userId} = await response.json();
    // await AsyncStorage.setItem(tokenKey, value.access_token);
    return {message, userId};
  } catch (e) {
    console.log(e, 'e inside getUserNonce');
    return Promise.reject(e);
  }
}
