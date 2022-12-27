import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, select} from 'redux-saga/effects';

import {defaultNetwork, storageKeys} from 'services/config';
import {asyncAlert} from 'utilities/helpers/alert';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {useUserWeb3} from '../web3/web3';
import {clearUserNonce} from '../web3/web3';
import {TReduxState} from '../../store';
import {changeCheckMetaData} from 'ranger-redux/modules/settings/settings';

export type TProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt?: string | null;
  idCard?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  mobile?: string | null;
  mobileCountry?: string | null;
  mobileVerifiedAt?: string | null;
  isVerified: boolean;
};

export type TProfileForm = {
  userId: string;
  accessToken: string;
};

const Profile = new ReduxFetchState<TProfile, TProfileForm, string>('profile');

export function* watchProfile() {
  try {
    const res: FetchResult<TProfile> = yield sagaFetch<TProfile>('/user/getme/user');
    yield put(changeCheckMetaData(true));
    yield put(Profile.actions.loadSuccess(res.result));
  } catch (e: any) {
    yield put(Profile.actions.loadFailure(e));
    yield handleSagaFetchError(e);
  }
}

export function* profileSagas() {
  yield takeEvery(Profile.actionTypes.load, watchProfile);
}

export enum UserStatus {
  Loading,
  Unverified,
  Pending,
  Verified,
}

export type TUseProfile = {
  loading: boolean;
  loaded: boolean;
  form: TProfileForm | null;
  error: string | null;
  dispatchProfile: () => void;
  profile: TProfile | null;
  status: UserStatus;
  handleLogout: (userPressed?: boolean) => void;
};

export function useProfile(): TUseProfile {
  const {data, ...profileState} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  const {offlineTrees, dispatchResetOfflineTrees} = useOfflineTrees();
  const {network: currentNetwork, userId, accessToken} = useUserWeb3();
  const {t} = useTranslation();

  const dispatchProfile = useCallback(() => {
    dispatch(Profile.actions.load({accessToken, userId}));
  }, [accessToken, dispatch, userId]);

  const status: UserStatus = useMemo(() => {
    if (!data) {
      return UserStatus.Loading;
    }
    if (!data?.isVerified && !data?.firstName) {
      return UserStatus.Unverified;
    }
    if (!data.isVerified && data?.firstName) {
      return UserStatus.Pending;
    }
    return UserStatus.Verified;
  }, [data]);

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
        }
        // * @logic-hook
        // const locale = await AsyncStorage.getItem(storageKeys.locale);
        // const onBoarding = await AsyncStorage.getItem(storageKeys.onBoarding);
        const network = currentNetwork || defaultNetwork;
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
        dispatch(Profile.actions.resetCache());
        dispatch(clearUserNonce());
        // await resetWeb3Data();
        // @logout
        // dispatch(profileActions.resetCache());
      } catch (e) {
        console.log(e, 'e inside handleLogout');
        return Promise.reject(e);
      }
    },
    [currentNetwork, dispatch, dispatchResetOfflineTrees, offlineTrees.planted, offlineTrees.updated, t],
  );

  return {
    ...profileState,
    dispatchProfile,
    profile: data,
    status,
    handleLogout,
  };
}

export const {actionTypes: profileActionsTypes, actions: profileActions, reducer: profileReducer} = Profile;

export function* selectProfile() {
  return yield select((state: TReduxState) => state.profile.data);
}
