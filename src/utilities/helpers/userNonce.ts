export async function getUserNonce(treejerApiUrl: string, publicAddress: string) {
  try {
    const response = await fetch(`${treejerApiUrl}/user/nonce?publicAddress=${publicAddress}`, {
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
