import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import config from './config';

const Web3Context = React.createContext({
  web3: {} as Web3,
  unlocked: false,
  storePrivateKey: (async () => {}) as (privateKey: string, password?: string) => Promise<void>,
  accessToken: '',
  treeFactory: {} as Contract,
  gbFactory: {} as Contract,
});

interface Props {
  children: React.ReactNode;
  privateKey?: string;
}

function Web3Provider({children, privateKey}: Props) {
  const web3 = useMemo(() => new Web3(config.web3Url), []);
  const [accessToken, setAccessToken] = useState('');
  const treeFactory = useContract(web3, config.contracts.TreeFactory);
  const gbFactory = useContract(web3, config.contracts.GBFactory);

  useEffect(() => {
    if (privateKey) {
      Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA1, privateKey).then(hash => {
        const key = `item_${hash}`;

        AsyncStorage.getItem(key).then(accessToken => {
          if (accessToken) {
            setAccessToken(accessToken);
          } else {
            fetch(`${config.treejerApiUrl}oauth/token`, {
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
            })
              .then(response => response.json())
              .then(value => {
                AsyncStorage.setItem(key, value.access_token);
                setAccessToken(value.access_token);
              });
          }
        });
      });
    }
  }, [privateKey]);

  const [unlocked, setUnlocked] = useState(Boolean(privateKey));
  const mounted = useRef(false);

  if (privateKey && !mounted.current) {
    web3.eth.accounts.wallet.add(privateKey);
  }

  const storePrivateKey = useCallback(async (privateKey: string) => {
    web3.eth.accounts.wallet.add(privateKey);

    await SecureStore.setItemAsync(config.storageKeys.privateKey, privateKey);
    setUnlocked(true);
  }, []);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    // SecureStore.deleteItemAsync(PASSWORD_PATH);
    // SecureStore.deleteItemAsync(config.storageKeys.privateKey);
    // SecureStore.deleteItemAsync(PRIVATE_KEY_V3_PATH);
  }, []);

  const value = useMemo(
    () => ({
      web3,
      storePrivateKey,
      unlocked,
      accessToken,
      gbFactory,
      treeFactory,
    }),
    [web3, storePrivateKey, unlocked, accessToken, gbFactory, treeFactory],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export default memo(Web3Provider);

const useContract = (web3: Web3, {abi, address}: {abi: any; address: string}) =>
  useMemo(() => new web3.eth.Contract(abi, address), [web3]);

export const useWeb3 = () => useContext(Web3Context).web3;
export const useAccessToken = () => useContext(Web3Context).accessToken;
export const usePrivateKeyStorage = () => {
  const {storePrivateKey, unlocked} = useContext(Web3Context);

  return {
    storePrivateKey,
    unlocked,
  };
};

export const usePersistedWallet = () => {
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  SecureStore.getItemAsync(config.storageKeys.privateKey).then(key => {
    if (key) {
      setPrivateKey(key);
    }

    setLoaded(true);
  });

  return [loaded, privateKey] as const;
};
