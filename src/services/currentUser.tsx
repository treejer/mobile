import {useLazyQuery} from '@apollo/client';
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getMeQuery, {GetMeQueryData} from './graphql/GetMeQuery.graphql';
import {asyncAlert} from 'utilities/helpers/alert';
import config from 'services/config';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {useSettings} from 'services/settings';
import {useResetWeb3Data, useWalletAccount} from 'services/web3';
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
  const {resetOnBoardingData, changeUseGsn} = useSettings();
  const {resetWeb3Data} = useResetWeb3Data();
  const {t} = useTranslation();

  const {error, loading} = result;
  // @ts-ignore
  const statusCode = error?.networkError?.result?.error?.statusCode;

  useEffect(() => {
    (async function () {
      const localUser = await AsyncStorage.getItem(config.storageKeys.user);
      if (localUser) {
        setCurrentUser(JSON.parse(localUser));
      }
    })();
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      const newUser = await refetch();
      if (newUser?.data?.user) {
        setCurrentUser(newUser.data.user);
        await AsyncStorage.setItem(config.storageKeys.user, JSON.stringify(newUser.data.user));
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
    async (userPressed: boolean) => {
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
          await AsyncStorage.removeItem(config.storageKeys.magicToken);
        }
        const locale = await AsyncStorage.getItem(config.storageKeys.locale);
        const keys = (await AsyncStorage.getAllKeys()) as string[];
        await AsyncStorage.multiRemove(keys);
        dispatchResetOfflineTrees();
        changeUseGsn(true);
        await AsyncStorage.setItem(config.storageKeys.locale, locale);
        if (!userPressed) {
          if (offlineTrees.planted) {
            await AsyncStorage.setItem(offlineTreesStorageKey, JSON.stringify(offlineTrees.planted));
          }
          if (offlineTrees.updated) {
            await AsyncStorage.setItem(offlineUpdatedTreesStorageKey, JSON.stringify(offlineTrees.updated));
          }
        }
        await resetWeb3Data();
        await resetOnBoardingData();
        await setCurrentUser(null);
      } catch (e) {
        console.log(e, 'e inside handleLogout');
        return Promise.reject(e);
      }
    },
    [offlineTrees.planted, offlineTrees.updated, resetOnBoardingData, resetWeb3Data, t],
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
