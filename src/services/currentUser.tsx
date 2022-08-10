import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getMeQuery, {GetMeQueryData} from './graphql/GetMeQuery.graphql';
import {asyncAlert} from 'utilities/helpers/alert';
import {defaultLocale, defaultNetwork, storageKeys} from 'services/config';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {useSettings} from 'services/settings';
import {useAccessToken, useResetWeb3Data, useUserId, useWalletAccount} from 'services/web3';
import {useTranslation} from 'react-i18next';
import {useFetch} from 'utilities/hooks/useFetch';
import {useLazyQuery} from '@apollo/client';

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

  // const [refetch, result] = useLazyQuery<GetMeQueryData>(getMeQuery, {
  //   fetchPolicy: 'cache-and-network',
  // });

  //@ts-ignore
  // const statusCode = error?.networkErrro?.statusCode;

  const accessToken = useAccessToken();
  const userId = useUserId();

  console.log({accessToken, userId});

  const headers = useMemo(
    () => ({
      'x-auth-userid': userId,
      'x-auth-logintoken': accessToken,
      Accept: 'application/json',
    }),

    [accessToken, userId],
  );

  const {data: user, loading, error, refetch} = useFetch<GetMeQueryData.User | null>('/user/getme/user', headers);

  //@ts-ignore
  const statusCode = error?.response?.data?.statusCode;
  const {offlineTrees, dispatchResetOfflineTrees} = useOfflineTrees();

  const wallet = useWalletAccount();
  const {changeUseGsn} = useSettings();
  const {resetWeb3Data} = useResetWeb3Data();
  const {t} = useTranslation();

  useEffect(() => {
    (async function () {
      const localUser = await AsyncStorage.getItem(storageKeys.user);
      if (localUser) {
        setCurrentUser(JSON.parse(localUser));
      }
    })();
  }, []);

  const refetchUser = useCallback(async () => {
    try {
      const {data: user} = await refetch();
      if (user) {
        setCurrentUser(user);
        await AsyncStorage.setItem(storageKeys.user, JSON.stringify(user));
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
        const locale = await AsyncStorage.getItem(storageKeys.locale);
        const onBoarding = await AsyncStorage.getItem(storageKeys.onBoarding);
        const network = (await AsyncStorage.getItem(storageKeys.blockchainNetwork)) || defaultNetwork;
        const keys = (await AsyncStorage.getAllKeys()) as string[];
        await AsyncStorage.multiRemove(keys);
        dispatchResetOfflineTrees();
        changeUseGsn(true);
        await AsyncStorage.setItem(storageKeys.locale, locale || defaultLocale);
        await AsyncStorage.setItem(storageKeys.onBoarding, (onBoarding || 0).toString());
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
    [changeUseGsn, dispatchResetOfflineTrees, offlineTrees.planted, offlineTrees.updated, resetWeb3Data, t],
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
