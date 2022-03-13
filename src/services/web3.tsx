import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import Web3, {magicGenerator, Magic} from 'services/Magic';
import {Account} from 'web3-core';
import {Contract} from 'web3-eth-contract';
import {Alert} from 'react-native';
import {getTreejerApiAccessToken} from 'utilities/helpers/getTreejerApiAccessToken';
import configs, {BlockchainNetwork, NetworkConfig, storageKeys} from './config';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';

export interface Web3ContextState {
  web3: null | Web3;
  unlocked: boolean;
  accessToken: string;
  treeFactory: Contract;
  planter: Contract;
  planterFund: Contract;
  resetWeb3Data: () => void;
  waiting: boolean;
  userId: string;
  magicToken: string;
  storeMagicToken: (token: string) => void;
  wallet: null | string;
  loading: boolean;
  network: BlockchainNetwork;
  magic: Magic | null;
  changeNetwork: (network: BlockchainNetwork) => void;
  config: NetworkConfig;
}

const initialValue: Web3ContextState = {
  web3: {} as Web3,
  unlocked: false,
  accessToken: '',
  treeFactory: {} as Contract,
  planter: {} as Contract,
  planterFund: {} as Contract,
  resetWeb3Data() {},
  waiting: false,
  userId: '',
  magicToken: '',
  storeMagicToken: (token: string) => {},
  wallet: null,
  loading: true,
  network: BlockchainNetwork.Rinkeby,
  magic: null,
  changeNetwork: () => {},
  config: configs[BlockchainNetwork.Rinkeby],
};

export const Web3Context = React.createContext(initialValue);

interface Props {
  children: React.ReactNode;
  persistedMagicToken?: string;
  persistedWallet?: string;
  persistedAccessToken?: string;
  persistedUserId?: string;
  blockchainNetwork?: BlockchainNetwork;
}

// new Web3(magic.rpcProvider)

function Web3Provider(props: Props) {
  const {
    children,
    persistedMagicToken,
    persistedWallet = null,
    persistedAccessToken = '',
    persistedUserId = '',
    blockchainNetwork,
  } = props;
  const [loading, setLoading] = useState<boolean>(true);

  const [network, setNetwork] = useState<BlockchainNetwork>(blockchainNetwork);
  const config = useMemo(() => configs[network], [network]);
  const magic = useMemo<Magic>(() => magicGenerator(config), [config]);
  const web3 = useMemo(() => new Web3(magic.rpcProvider), [magic]);

  console.log(config, 'config is here');

  const [wallet, setWallet] = useState<null | string>(persistedWallet);
  const [magicToken, setMagicToken] = useState<string>(persistedMagicToken);
  const [waiting, setWaiting] = useState<boolean>(true);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>(persistedAccessToken);
  const [userId, setUserId] = useState<string>(persistedUserId);

  const treeFactory = useContract(web3, config.contracts.TreeFactory);
  const planter = useContract(web3, config.contracts.Planter);
  const planterFund = useContract(web3, config.contracts.PlanterFund);
  const {t} = useTranslation();

  const isConnected = useNetInfoConnected();

  const previousWeb3 = useRef<Web3 | null>(null);

  const addToWallet = useCallback(
    (privateKey: string) => {
      web3.eth.accounts.wallet.add(privateKey);
    },
    [web3],
  );

  const updateAccessToken = useCallback(async () => {
    try {
      console.log('[[[[try]]]]');
      const credentials = await getTreejerApiAccessToken(config.treejerApiUrl, web3);
      setAccessToken(credentials.loginToken);
      if (credentials.loginToken) {
        await AsyncStorage.setItem(storageKeys.accessToken, credentials.loginToken);
      } else {
        await AsyncStorage.removeItem(storageKeys.accessToken);
      }

      setUserId(credentials.userId);
      if (credentials.userId) {
        await AsyncStorage.setItem(storageKeys.userId, credentials.userId);
      } else {
        await AsyncStorage.removeItem(storageKeys.userId);
      }
      setUnlocked(true);
      let web3Accounts = [credentials.wallet];
      await web3.eth.getAccounts(async (error, accounts) => {
        if (error) {
          console.log(error, 'e is here getAccounts eth');
          setWaiting(false);
          setLoading(false);
          web3Accounts = accounts;
          return;
        }
        const account = web3Accounts[0];
        if (account) {
          await AsyncStorage.setItem(storageKeys.magicWalletAddress, account);
          setWallet(account);
          setWaiting(false);
          setLoading(false);
        }
      });
    } catch (error) {
      console.log('[[[[catch]]]]');
      let {error: {message = t('loginFailed.message')} = {}} = error;
      if (error.message) {
        message = error.message;
      }
      setWaiting(false);
      setLoading(false);
      Alert.alert(t('loginFailed.title'), message);
    }
  }, [config.treejerApiUrl, t, web3]);

  const storeMagicToken = useCallback(
    async (token: string) => {
      setMagicToken(token);
      // addToWallet(token);

      await AsyncStorage.setItem(storageKeys.magicToken, token);
      if (isConnected) {
        await updateAccessToken();
      } else {
        setWaiting(false);
        setLoading(false);
        setUnlocked(true);
      }
    },
    [isConnected, updateAccessToken],
  );

  const resetWeb3Data = useCallback(async () => {
    await setUnlocked(false);
    await setAccessToken('');
    await setWallet(null);
  }, []);

  const changeNetwork = useCallback(async (newNetwork: BlockchainNetwork) => {
    setNetwork(newNetwork);
    try {
      await AsyncStorage.setItem(storageKeys.blockchainNetwork, newNetwork);
    } catch (error) {
      console.log(error, 'error is here');
    }
  }, []);

  useEffect(() => {
    (async function () {
      try {
        const magicWalletAddress = await AsyncStorage.getItem(storageKeys.magicWalletAddress);
        if (magicWalletAddress) {
          setWallet(magicWalletAddress);
        }
      } catch (error) {
        console.log(error, 'error');
      }
      console.log(persistedMagicToken, 'persistedMagicToken');
      if (persistedMagicToken) {
        await storeMagicToken(persistedMagicToken);
      } else {
        setWaiting(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      web3,
      unlocked,
      accessToken,
      treeFactory,
      waiting,
      resetWeb3Data,
      userId,
      planter,
      planterFund,
      magicToken,
      storeMagicToken,
      wallet,
      loading,
      network,
      magic,
      changeNetwork,
      config,
    }),
    [
      web3,
      unlocked,
      accessToken,
      treeFactory,
      waiting,
      resetWeb3Data,
      userId,
      planter,
      planterFund,
      magicToken,
      storeMagicToken,
      wallet,
      loading,
      network,
      magic,
      changeNetwork,
      config,
    ],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

const useContract = (web3: Web3, {abi, address}: {abi: any; address: string}) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => new web3.eth.Contract(abi, address), [web3, address]);

export default memo(Web3Provider);

export const useWeb3 = () => useContext<Web3ContextState>(Web3Context).web3;
export const useConfig = () => useContext<Web3ContextState>(Web3Context).config;
export const useChangeNetwork = () => useContext<Web3ContextState>(Web3Context).changeNetwork;
export const useMagic = () => useContext<Web3ContextState>(Web3Context).magic;
export const useWalletWeb3 = () => useContext<Web3ContextState>(Web3Context).web3;
export const useTreeFactory = () => useContext<Web3ContextState>(Web3Context).treeFactory;
export const usePlanter = () => useContext<Web3ContextState>(Web3Context).planter;
export const usePlanterFund = () => useContext<Web3ContextState>(Web3Context).planterFund;
export const useResetWeb3Data = () => {
  const resetWeb3Data = useContext<Web3ContextState>(Web3Context).resetWeb3Data;
  return {resetWeb3Data};
};
export const useWalletAccount = (): string | null => {
  return useContext<Web3ContextState>(Web3Context).wallet;
};
export const useWalletAccountTorus = (): Account | null => {
  const web3 = useWeb3();
  return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
};
export const useAccessToken = () => useContext<Web3ContextState>(Web3Context).accessToken;
export const useUserId = () => useContext<Web3ContextState>(Web3Context).userId;

export const usePrivateKeyStorage = () => {
  const {unlocked, storeMagicToken} = useContext<Web3ContextState>(Web3Context);

  return {
    unlocked,
    storeMagicToken,
  };
};

export const usePersistedWallet = () => {
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(storageKeys.privateKey)
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
    AsyncStorage.getItem(storageKeys.magicToken)
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
