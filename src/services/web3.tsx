import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import Web3 from 'web3';
import {Account} from 'web3-core';
import {Contract} from 'web3-eth-contract';
import {Alert} from 'react-native';
import {getTreejerApiAccessToken, getTreejerPrivateKeyApiAccessToken} from 'utilities/helpers/getTreejerApiAccessToken';
import config from './config';
import {useTranslation} from 'react-i18next';
import {magic} from 'services/Magic';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialValue = {
  web3: {} as Web3,
  walletWeb3: {} as Web3,
  unlocked: false,
  storePrivateKey: (async () => {}) as (privateKey: string, password?: string) => Promise<void>,
  accessToken: '',
  treeFactory: {} as Contract,
  planter: {} as Contract,
  planterFund: {} as Contract,
  resetWeb3Data() {},
  waiting: false,
  userId: '',
  magicToken: '',
  storeMagicToken: (token: string) => {},
};

export const Web3Context = React.createContext(initialValue);

interface Props {
  children: React.ReactNode;
  privateKey?: string;
  persistedMagicToken?: string;
}

function Web3Provider({children, privateKey, persistedMagicToken}: Props) {
  const web3 = useMemo(() => new Web3(magic.rpcProvider), []);

  const [walletWeb3, setWalletWeb3] = useState<Web3>();
  const [magicToken, setMagicToken] = useState<string>('');
  const [waiting, setWaiting] = useState<boolean>(true);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const treeFactory = useContract(web3, config.contracts.TreeFactory);
  const planter = useContract(web3, config.contracts.Planter);
  const planterFund = useContract(web3, config.contracts.PlanterFund);
  const {t} = useTranslation();

  const previousWeb3 = useRef<Web3 | null>(null);

  const addToWallet = useCallback(
    (privateKey: string) => {
      web3.eth.accounts.wallet.add(privateKey);
    },
    [web3],
  );

  const updateAccessTokenWithPrivateKey = useCallback(
    async (privateKey: string) => {
      try {
        const credentials = await getTreejerPrivateKeyApiAccessToken(privateKey, web3);
        setAccessToken(credentials.loginToken);
        setUserId(credentials.userId);
        setUnlocked(true);
        setWalletWeb3(web3);
      } catch (e) {
        const {error: {message = t('loginFailed.message')} = {}} = e;
        Alert.alert(t('loginFailed.title'), message);
        console.log(e, 'e inside updateAccessToken');
      }

      setWaiting(false);
    },
    [t, web3],
  );

  const updateAccessToken = useCallback(async () => {
    try {
      const credentials = await getTreejerApiAccessToken(web3);
      setAccessToken(credentials.loginToken);
      setUserId(credentials.userId);
      setUnlocked(true);
      setWalletWeb3(web3);
    } catch (e) {
      let {error: {message = t('loginFailed.message')} = {}} = e;
      if (e.message) {
        message = e.message;
      }
      Alert.alert(t('loginFailed.title'), message);
    } finally {
      setWaiting(false);
    }
  }, [t, web3]);

  const storeMagicToken = useCallback(
    async (token: string) => {
      setMagicToken(token);
      // addToWallet(token);

      await AsyncStorage.setItem(config.storageKeys.magicToken, token);
      await updateAccessToken();
    },
    [updateAccessToken],
  );

  const resetWeb3Data = useCallback(async () => {
    await setUnlocked(false);
    await setAccessToken('');
  }, []);

  const storePrivateKey = useCallback(
    async (privateKey: string) => {
      addToWallet(privateKey);

      await AsyncStorage.setItem(config.storageKeys.privateKey, privateKey);
      await updateAccessTokenWithPrivateKey(privateKey);
    },
    [updateAccessTokenWithPrivateKey, addToWallet],
  );

  useEffect(() => {
    (async function () {
      if (persistedMagicToken) {
        console.log('gets hdre', persistedMagicToken);
        await storeMagicToken(persistedMagicToken);
      } else {
        setWaiting(false);
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (privateKey) {
  //     updateAccessTokenWithPrivateKey(privateKey);
  //   } else {
  //     setWaiting(false);
  //   }
  // }, [privateKey, updateAccessTokenWithPrivateKey]);

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
      walletWeb3,
      treeFactory,
      waiting,
      resetWeb3Data,
      userId,
      planter,
      planterFund,
      magicToken,
      storeMagicToken,
    }),
    [
      web3,
      storePrivateKey,
      unlocked,
      accessToken,
      walletWeb3,
      treeFactory,
      waiting,
      resetWeb3Data,
      userId,
      planter,
      planterFund,
      magicToken,
      storeMagicToken,
    ],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

const useContract = (web3: Web3, {abi, address}: {abi: any; address: string}) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => new web3.eth.Contract(abi, address), [web3, address]);

export default memo(Web3Provider);

export const useWeb3 = () => useContext(Web3Context).web3;
export const useWalletWeb3 = () => useContext(Web3Context).walletWeb3;
export const useTreeFactory = () => useContext(Web3Context).treeFactory;
export const usePlanter = () => useContext(Web3Context).planter;
export const usePlanterFund = () => useContext(Web3Context).planterFund;
export const useResetWeb3Data = () => {
  const resetWeb3Data = useContext(Web3Context).resetWeb3Data;
  return {resetWeb3Data};
};
export const useWalletAccount = (): string | null => {
  const [wallet, setWallet] = useState<null | string>(null);
  const web3 = useWeb3();

  useEffect(() => {
    (async function () {
      await web3.eth.getAccounts((e, accounts) => {
        if (e) {
          console.log(e, 'e is here getAccounts eth');
        }
        setWallet(accounts[0]);
      });
    })();
  }, []);

  return wallet;
};
export const useWalletAccountTorus = (): Account | null => {
  const web3 = useWeb3();
  return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
};
export const useAccessToken = () => useContext(Web3Context).accessToken;
export const useUserId = () => useContext(Web3Context).userId;

export const usePrivateKeyStorage = () => {
  const {storePrivateKey, unlocked, storeMagicToken} = useContext(Web3Context);

  return {
    storePrivateKey,
    unlocked,
    storeMagicToken,
  };
};

export const usePersistedWallet = () => {
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(config.storageKeys.privateKey)
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

export const usePersistedMagic = () => {
  const [magicToken, setMagicToken] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(config.storageKeys.magicToken)
      .then(key => {
        if (key) {
          setMagicToken(key);
        }

        setLoaded(true);
      })
      .catch(() => {
        console.warn('Failed to get fetch stored magic token');
      });
  }, []);

  return [loaded, magicToken] as const;
};
