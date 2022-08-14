import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BlockchainNetwork, defaultNetwork, storageKeys} from 'services/config';

interface InitialValueHookResult {
  loading: boolean;
  wallet?: string;
  accessToken?: string;
  userId?: string;
  magicToken?: string;
  blockchainNetwork?: BlockchainNetwork;
}

export const useAppInitialValue = () => {
  const [initialValue, setInitialValue] = useState<InitialValueHookResult>({
    loading: true,
  });

  useEffect(() => {
    AsyncStorage.multiGet([
      storageKeys.userId,
      storageKeys.user,
      storageKeys.accessToken,
      storageKeys.magicWalletAddress,
      storageKeys.magicToken,
      storageKeys.blockchainNetwork,
    ])
      .then(stores => {
        if (Array.isArray(stores)) {
          const result = stores.reduce(
            (acc, [key, value]) => {
              switch (key) {
                case storageKeys.magicWalletAddress:
                  return {
                    ...acc,
                    wallet: value,
                  };
                case storageKeys.accessToken:
                  return {
                    ...acc,
                    accessToken: value,
                  };
                case storageKeys.userId:
                  return {
                    ...acc,
                    userId: value,
                  };
                case storageKeys.magicToken:
                  return {
                    ...acc,
                    magicToken: value,
                  };
                case storageKeys.blockchainNetwork:
                  return {
                    ...acc,
                    blockchainNetwork: value === null ? defaultNetwork : value,
                  };
                default:
                  return acc;
              }
            },
            {loading: false} as InitialValueHookResult,
          );
          setInitialValue(result);
        } else {
          setInitialValue({loading: false});
        }
      })
      .catch(() => {
        console.warn('Failed to get settings info from storage');
        setInitialValue({
          ...initialValue,
          loading: false,
        });
      });
  }, []);

  return initialValue;
};
