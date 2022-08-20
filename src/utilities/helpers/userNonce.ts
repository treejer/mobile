import {GetUserNonceAdditionalParams} from 'services/web3';

export async function getUserNonce(
  treejerApiUrl: string,
  publicAddress: string,
  token: string,
  additionalParams: GetUserNonceAdditionalParams = {},
) {
  const {country, email, mobile} = additionalParams;

  const searchParams = new URLSearchParams();
  searchParams.set('publicAddress', publicAddress);
  searchParams.set('token', token);

  if (email) {
    searchParams.set('email', email);
  }
  if (mobile && country) {
    searchParams.set('mobile', mobile);
    searchParams.set('country', country);
  }

  try {
    const response = await fetch(`${treejerApiUrl}/user/nonce?${searchParams.toString()}`, {
      method: 'POST',
    });

    const {message, userId} = await response.json();
    // await AsyncStorage.setItem(tokenKey, value.access_token);
    return {message, userId};
  } catch (e) {
    console.log(e, 'e inside getUserNonce');
    return Promise.reject(e);
  }
}
