import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import Web3 from 'web3';
import {Account} from 'web3-core';
import {Contract} from 'web3-eth-contract';
import {getTreejerApiAccessToken} from 'utilities/helpers/getTreejerApiAccessToken';

import config from './config';

export const Web3Context = React.createContext({
  web3: {} as Web3,
  unlocked: false,
  storePrivateKey: (async () => {}) as (privateKey: string, password?: string) => Promise<void>,
  accessToken: '',
  treeFactory: {} as Contract,
  gbFactory: {} as Contract,
  updateFactory: {} as Contract,
  waiting: false,
});

interface Props {
  children: React.ReactNode;
  privateKey?: string;
}

function Web3Provider({children, privateKey}: Props) {
  const web3 = useMemo(() => new Web3(config.web3Url), []);

  const [waiting, setWaiting] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const treeFactory = useContract(web3, config.contracts.TreeFactory);
  const gbFactory = useContract(web3, config.contracts.GBFactory);
  const updateFactory = useContract(web3, config.contracts.UpdateFactory);

  const previousWeb3 = useRef<Web3 | null>(null);

  const addToWallet = useCallback(
    (privateKey: string) => {
      web3.eth.accounts.wallet.add(privateKey);
    },
    [web3],
  );

  const updateAccessToken = useCallback(
    (privateKey: string) =>
      getTreejerApiAccessToken(privateKey, web3)
        .then(accessToken => {
          setAccessToken(accessToken);
        })
        .finally(() => {
          setWaiting(false);
          setUnlocked(true);
        }),
    [web3],
  );

  const storePrivateKey = useCallback(
    async (privateKey: string) => {
      addToWallet(privateKey);

      await SecureStore.setItemAsync(config.storageKeys.privateKey, privateKey);
      await updateAccessToken(privateKey);
    },
    [updateAccessToken, addToWallet],
  );

  useEffect(() => {
    if (privateKey) {
      updateAccessToken(privateKey);
    } else {
      setWaiting(false);
    }
  }, [privateKey, updateAccessToken]);

  // Because adding an account to wallet does not trigger a re-render, this needs to be done here instead of useEffect
  if (privateKey && previousWeb3.current !== web3) {
    previousWeb3.current = web3;
    addToWallet(privateKey);
  }

  const value = useMemo(
    () => ({
      web3,
      storePrivateKey,
      unlocked,
      accessToken,
      gbFactory,
      treeFactory,
      updateFactory,
      waiting,
    }),
    [web3, storePrivateKey, unlocked, accessToken, gbFactory, treeFactory, updateFactory, waiting],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

const useContract = (web3: Web3, {abi, address}: {abi: any; address: string}) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => new web3.eth.Contract(abi, address), [web3, address]);

export default memo(Web3Provider);

export const useWeb3 = () => useContext(Web3Context).web3;
export const useTreeFactory = () => useContext(Web3Context).treeFactory;
export const useGBFactory = () => useContext(Web3Context).gbFactory;
export const useUpdateFactory = () => useContext(Web3Context).updateFactory;
export const useWalletAccount = (): Account | null => {
  const web3 = useWeb3();
  return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
};
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

  useEffect(() => {
    SecureStore.getItemAsync(config.storageKeys.privateKey)
      .then(key => {
        if (key) {
          setPrivateKey(key);
        }

        setLoaded(true);
      })
      .catch(() => {
        console.warn('Failed to get fetch stored private key');
      });
  }, []);

  return [loaded, privateKey] as const;
};
