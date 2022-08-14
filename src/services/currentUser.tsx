import {useLazyQuery} from '@apollo/client';
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getMeQuery, {GetMeQueryData} from './graphql/GetMeQuery.graphql';
import {asyncAlert} from 'utilities/helpers/alert';
import {defaultLocale, defaultNetwork, storageKeys} from 'services/config';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {useSettings} from 'utilities/hooks/useSettings';
import {useUserWeb3, useWalletAccount} from 'utilities/hooks/useWeb3';
import {useTranslation} from 'react-i18next';

export enum UserStatus {
  Loading,
  Unverified,
  Pending,
  Verified,
}

export interface CurrentUserContextState {
  status: UserStatus | null;
  data: {
    user: null | GetMeQueryData.User;
  };
  loading?: boolean;
  error?: any;
  refetchUser: () => void;
  handleLogout: (userPressed?: boolean) => void;
}

const initialCurrentUserContext: CurrentUserContextState = {
  status: null,
  data: {
    user: null,
  },
  refetchUser: () => {},
  handleLogout: () => {},
};

export const CurrentUserContext = createContext<CurrentUserContextState>(initialCurrentUserContext);

export interface UseCurrentUserOptions {
  didMount?: boolean;
}

const useCurrentUserDefaultOptions: UseCurrentUserOptions = {
  didMount: false,
};

export function useCurrentUser(options: UseCurrentUserOptions = useCurrentUserDefaultOptions): CurrentUserContextState {
  const {didMount} = options;

  const context = useContext(CurrentUserContext);
  const {refetchUser} = context;

  useEffect(() => {
    if (didMount) {
      refetchUser();
    }
  }, []);

  return context;
}

export function CurrentUserProvider(props) {
  const {children} = props;
  const [currentUser, setCurrentUser] = useState<GetMeQueryData.User | null>(null);
  const [refetch, result] = useLazyQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const {offlineTrees, dispatchResetOfflineTrees} = useOfflineTrees();

  const wallet = useWalletAccount();
  const {changeUseGSN} = useSettings();
  const {resetWeb3Data} = useUserWeb3();
  const {t} = useTranslation();

  const {error, loading} = result;
  // @ts-ignore
  const statusCode = error?.networkError?.statusCode;

  // useEffect(() => {
  //   (async function () {
  //     const localUser = await AsyncStorage.getItem(storageKeys.user);
  //     if (localUser) {
  //       setCurrentUser(JSON.parse(localUser));
  //     }
  //   })();
  // }, []);

  const refetchUser = useCallback(async () => {
    try {
      const newUser = await refetch();
      if (newUser?.data?.user) {
        setCurrentUser(newUser.data.user);
        await AsyncStorage.setItem(storageKeys.user, JSON.stringify(newUser.data.user));
      }
    } catch (e) {
      console.log(e, 'e inside refetchUser');
    }
  }, [refetch]);

  const status: UserStatus = useMemo(() => {
    if (!currentUser) {
      return UserStatus.Loading;
    }
    if (!currentUser?.isVerified && !currentUser?.firstName) {
      return UserStatus.Unverified;
    }
    if (!currentUser.isVerified && currentUser?.firstName) {
      return UserStatus.Pending;
    }
    return UserStatus.Verified;
  }, [currentUser]);

  const handleLogout = useCallback(
    async (userPressed?: boolean) => {
      try {
        if (userPressed) {
          try {
            if (offlineTrees.planted || offlineTrees.updated) {
              const trees = [...(offlineTrees.planted || []), ...(offlineTrees.updated || [])];

              if (trees.length) {
                const isMoreThanOne = trees.length > 1;
                const treeText = isMoreThanOne ? 'trees' : 'tree';
                const treeThereText = isMoreThanOne ? 'they are' : 'it is';

                await asyncAlert(
                  t('myProfile.attention'),
                  t('myProfile.looseTree', {treesLength: trees.length, treeText, treeThereText}),
                  {text: t('myProfile.logoutAndLoose')},
                  {text: t('cancel')},
                );
              }
            }
          } catch (e) {
            return Promise.reject(e);
          }
          await AsyncStorage.removeItem(storageKeys.magicToken);
        }
        // * @logic-hook
        // const locale = await AsyncStorage.getItem(storageKeys.locale);
        // const onBoarding = await AsyncStorage.getItem(storageKeys.onBoarding);
        const network = (await AsyncStorage.getItem(storageKeys.blockchainNetwork)) || defaultNetwork;
        const keys = (await AsyncStorage.getAllKeys()) as string[];
        await AsyncStorage.multiRemove(keys);
        dispatchResetOfflineTrees();
        // changeUseGSN(true);
        // * @logic-hook
        // await AsyncStorage.setItem(storageKeys.locale, locale || defaultLocale);
        // await AsyncStorage.setItem(storageKeys.onBoarding, (onBoarding || 0).toString());
        await AsyncStorage.setItem(storageKeys.blockchainNetwork, network);
        if (!userPressed) {
          if (offlineTrees.planted) {
            await AsyncStorage.setItem(offlineTreesStorageKey, JSON.stringify(offlineTrees.planted));
          }
          if (offlineTrees.updated) {
            await AsyncStorage.setItem(offlineUpdatedTreesStorageKey, JSON.stringify(offlineTrees.updated));
          }
        }
        await resetWeb3Data();
        await setCurrentUser(null);
      } catch (e) {
        console.log(e, 'e inside handleLogout');
        return Promise.reject(e);
      }
    },
    [changeUseGSN, dispatchResetOfflineTrees, offlineTrees.planted, offlineTrees.updated, resetWeb3Data, t],
  );

  useEffect(() => {
    if (statusCode === 401) {
      handleLogout(false);
    }
  }, [handleLogout, statusCode, wallet]);

  const value: CurrentUserContextState = useMemo(
    () => ({
      status,
      data: {
        user: currentUser,
      },
      refetchUser,
      handleLogout,
      error,
      loading,
    }),
    [currentUser, error, handleLogout, loading, refetchUser, status],
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}
