import React, {memo, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Random from 'expo-random';
import Web3 from 'web3';

const Web3Context = React.createContext({
  web3: {} as Web3,
  unlocked: false,
  storePrivateKey: (async () => {}) as (privateKey: string, password?: string) => Promise<void>,
});

interface Props {
  children: React.ReactNode;
  privateKey?: string;
}

const WEB3_URL = 'https://ropsten.infura.io/v3/4fa831f320e94a26bcd607c5620be4d9';
const PRIVATE_KEY_V3_PATH = '__TREEJER_PRIVATE_KEY_V3';
const PRIVATE_KEY_PATH = '__TREEJER_PRIVATE_KEY';
const PASSWORD_PATH = '__TREEJER_PASSWORD';

function Web3Provider({children, privateKey}: Props) {
  const web3 = useMemo(() => new Web3(WEB3_URL), []);
  const [unlocked, setUnlocked] = useState(Boolean(privateKey));
  const mounted = useRef(false);

  if (privateKey && !mounted.current) {
    web3.eth.accounts.wallet.add(privateKey);
  }

  const storePrivateKey = useCallback(async (privateKey: string) => {
    web3.eth.accounts.wallet.add(privateKey);

    await SecureStore.setItemAsync(PRIVATE_KEY_PATH, privateKey);
    setUnlocked(true);
  }, []);

  useEffect(() => {
    mounted.current = true;
  }, []);

  useEffect(() => {
    // SecureStore.deleteItemAsync(PASSWORD_PATH);
    // SecureStore.deleteItemAsync(PRIVATE_KEY_PATH);
    // SecureStore.deleteItemAsync(PRIVATE_KEY_V3_PATH);
  }, []);

  const value = useMemo(
    () => ({
      web3,
      storePrivateKey,
      unlocked,
    }),
    [web3, storePrivateKey, unlocked],
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export default memo(Web3Provider);

export const useWeb3 = () => useContext(Web3Context).web3;
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

  SecureStore.getItemAsync(PRIVATE_KEY_PATH).then(key => {
    if (key) {
      setPrivateKey(key);
    }

    setLoaded(true);
  });

  return [loaded, privateKey] as const;
};
