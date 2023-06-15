import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, select} from 'redux-saga/effects';

import {defaultNetwork, storageKeys} from 'services/config';
import {TProfile} from 'webServices/profile/profile';
import {asyncAlert} from 'utilities/helpers/alert';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {getConfig, TWeb3, useUserWeb3} from '../web3/web3';
import {clearUserNonce} from '../web3/web3';
import {TReduxState} from '../../store';
import {changeCheckMetaData} from '../settings/settings';
import {useDraftedJourneys} from '../draftedJourneys/draftedJourneys.reducer';
import {plantedTreesActions} from '../trees/plantedTrees';
import {updatedTreesActions} from '../trees/updatedTrees';
import {assignedTreesActions} from '../trees/assignedTrees';
import {pendingTreeIdsActions} from '../trees/pendingTreeIds';

const Profile = new ReduxFetchState<TProfile, null, string>('profile');

export function* watchProfile() {
  try {
    const config: TWeb3['config'] = yield select(getConfig);
    const res: FetchResult<TProfile> = yield sagaFetch<TProfile>('/users/me');
    // TODO: check here for check metadata
    console.log(config, 'isMainnet');
    if (config.isMainnet) {
      yield put(changeCheckMetaData(true));
    }
    yield put(pendingTreeIdsActions.load());
    yield put(Profile.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(Profile.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* profileSagas() {
  yield takeEvery(Profile.actionTypes.load, watchProfile);
}

export function useProfile() {
  const {data, ...profileState} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  const {offlineTrees, dispatchResetOfflineTrees} = useOfflineTrees();
  const {dispatchClearDraftedJourneys} = useDraftedJourneys();
  const {network: currentNetwork} = useUserWeb3();
  const {t} = useTranslation();

  const dispatchProfile = useCallback(() => {
    dispatch(Profile.actions.load());
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
        }

        dispatchClearDraftedJourneys();
        dispatch(plantedTreesActions.resetCache());
        dispatch(updatedTreesActions.resetCache());
        dispatch(assignedTreesActions.resetCache());
        dispatch(pendingTreeIdsActions.resetCache());

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
    handleLogout,
  };
}

export const {actionTypes: profileActionsTypes, actions: profileActions, reducer: profileReducer} = Profile;

export function* selectProfile() {
  return yield select((state: TReduxState) => state.profile.data);
}

export const getProfile = (state: TReduxState) => state.profile.data;
