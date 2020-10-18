import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Web3 from "web3";

const Web3Context = React.createContext({
  web3: {} as Web3,
});

interface Props {
  children: React.ReactNode;
}

const WEB3_URL =
  "https://ropsten.infura.io/v3/4fa831f320e94a26bcd607c5620be4d9";
const PRIVATE_KEY_PATH = "priv";

function Web3Provider({ children }: Props) {
  const web3 = useMemo(() => new Web3(WEB3_URL), []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(PRIVATE_KEY_PATH).then((privateKey) => {
      setLoaded(true);

      if (privateKey) {
        web3.eth.accounts.wallet.add(privateKey);
      }
    });
  }, []);

  const value = useMemo(
    () => ({
      web3,
    }),
    [web3]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export default memo(Web3Provider);

export const useWeb3 = () => useContext(Web3Context).web3;
