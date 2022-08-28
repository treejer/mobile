import {useCallback, useMemo} from 'react';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {profileActions, TProfile} from '../redux/modules/user/user';
import {asyncAlert} from 'utilities/helpers/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {defaultNetwork, storageKeys} from 'services/config';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {useTranslation} from 'react-i18next';

enum UserStatus {
  Loading,
  Unverified,
  Pending,
  Verified,
}

export interface TUseCurrentUser {
  status: UserStatus | null;
  data: {
    user: null | TProfile;
  };
  loading?: boolean;
  error?: any;
  refetchUser: () => void;
  handleLogout: (userPressed?: boolean) => void;
}

export const useCurrentUser = (): TUseCurrentUser => {
  const user = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  const {offlineTrees, dispatchResetOfflineTrees} = useOfflineTrees();
  const {t} = useTranslation();

  const status: UserStatus = useMemo(() => {
    if (!user.data) {
      return UserStatus.Loading;
    }
    if (!user.data?.isVerified && !user.data?.firstName) {
      return UserStatus.Unverified;
    }
    if (!user.data.isVerified && user.data?.firstName) {
      return UserStatus.Pending;
    }
    return UserStatus.Verified;
  }, [user.data]);

  const refetchUser = useCallback(() => {
    dispatch(profileActions.load());
  }, [dispatch]);

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
        // await resetWeb3Data();
        // @logout
        // dispatch(profileActions.resetCache());
      } catch (e) {
        console.log(e, 'e inside handleLogout');
        return Promise.reject(e);
      }
    },
    [dispatchResetOfflineTrees, offlineTrees.planted, offlineTrees.updated, t],
  );

  return {
    data: {
      user: user.data,
    },
    refetchUser,
    handleLogout,
    status,
  };
};
