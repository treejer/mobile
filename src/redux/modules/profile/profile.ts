import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, select} from 'redux-saga/effects';

import {defaultNetwork, storageKeys} from 'services/config';
import {TProfile} from 'webServices/profile/profile';
import {asyncAlert} from 'utilities/helpers/alert';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {getConfig, TWeb3, useUserWeb3} from '../web3/web3';
import {TReduxState} from '../../store';
import {changeCheckMetaData} from '../settings/settings';
import {useDraftedJourneys} from '../draftedJourneys/draftedJourneys.reducer';
import {pendingTreeIdsActions, usePendingTreeIds} from '../trees/pendingTreeIds';
import {usePlantTree} from '../submitTreeEvents/plantTree';
import {useAssignedTree} from '../submitTreeEvents/assignedTree';
import {useTreeDetails} from '../trees/treeDetails';
import {useDeleteTreeEvent} from '../submitTreeEvents/deleteTreeEvent';
import {useUserNonce} from '../userNonce/userNonce';
import {useUserSign} from '../userSign/userSign';
import {useSearchPlaces} from '../searchPlaces/searchPlaces';
import {useRecentPlaces} from '../recentPlaces/recentPlaces';
import {useNotVerifiedTrees} from '../trees/useNotVerifiedTrees';
import {useVerification} from '../verification/useVerification';
import {useUpdateTree} from '../submitTreeEvents/updateTree';

const Profile = new ReduxFetchState<TProfile, null, string>('profile');

export function* watchProfile() {
  try {
    const config: TWeb3['config'] = yield select(getConfig);
    const res: FetchResult<TProfile> = yield sagaFetch<TProfile>('/users/me');
    if (config.isMainnet) {
      yield put(changeCheckMetaData(true));
    }
    yield put(Profile.actions.loadSuccess(res.result));
    yield put(pendingTreeIdsActions.load());
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

  const {dispatchClearDraftedJourneys, drafts} = useDraftedJourneys();
  const {network: currentNetwork} = useUserWeb3();
  const {dispatchResetRecentPlaces} = useRecentPlaces();
  const {dispatchResetAll} = useNotVerifiedTrees();
  const {dispatchResetPendingTreeIds} = usePendingTreeIds();
  const {dispatchResetSearchPlaces} = useSearchPlaces();
  const {dispatchResetUserSign} = useUserSign();
  const {dispatchResetUserNonce} = useUserNonce();
  const {dispatchResetDeleteEvent} = useDeleteTreeEvent();
  const {dispatchResetVerification} = useVerification();
  const {dispatchClearTreeDetails} = useTreeDetails();
  const {dispatchResetAssignedTree} = useAssignedTree();
  const {dispatchResetPlantTree} = usePlantTree();
  const {dispatchResetUpdateTree} = useUpdateTree();
  const {t} = useTranslation();

  const dispatchProfile = useCallback(() => {
    dispatch(Profile.actions.load());
  }, [dispatch]);

  const handleLogout = useCallback(
    async (userPressed?: boolean) => {
      try {
        if (userPressed) {
          try {
            if (drafts.length > 0) {
              const isMoreThanOne = drafts.length > 1;
              const treeText = isMoreThanOne ? 'trees' : 'tree';
              const treeThereText = isMoreThanOne ? 'they are' : 'it is';

              await asyncAlert(
                t('myProfile.attention'),
                t('myProfile.looseTree', {treesLength: drafts.length, treeText, treeThereText}),
                {text: t('myProfile.logoutAndLoose')},
                {text: t('cancel')},
              );
            }
          } catch (e) {
            return Promise.reject(e);
          }
        }

        dispatchClearDraftedJourneys();
        dispatchResetUpdateTree();
        dispatchResetPlantTree();
        dispatchResetAssignedTree();
        dispatchClearTreeDetails();
        dispatchResetVerification();
        dispatchResetDeleteEvent();
        dispatchResetUserNonce();
        dispatchResetUserSign();
        dispatchResetSearchPlaces();
        dispatchResetPendingTreeIds();
        dispatchResetAll();
        dispatchResetRecentPlaces();

        // * @logic-hook
        // const locale = await AsyncStorage.getItem(storageKeys.locale);
        // const onBoarding = await AsyncStorage.getItem(storageKeys.onBoarding);
        const network = currentNetwork || defaultNetwork;
        const keys = (await AsyncStorage.getAllKeys()) as string[];
        await AsyncStorage.multiRemove(keys);
        // changeUseGSN(true);
        // * @logic-hook
        // await AsyncStorage.setItem(storageKeys.locale, locale || defaultLocale);
        // await AsyncStorage.setItem(storageKeys.onBoarding, (onBoarding || 0).toString());
        await AsyncStorage.setItem(storageKeys.blockchainNetwork, network);
        dispatch(Profile.actions.resetCache());
        // await resetWeb3Data();
        // @logout
      } catch (e) {
        console.log(e, 'e inside handleLogout');
        return Promise.reject(e);
      }
    },
    [
      t,
      drafts,
      dispatch,
      currentNetwork,
      dispatchResetRecentPlaces,
      dispatchClearDraftedJourneys,
      dispatchResetUpdateTree,
      dispatchResetPlantTree,
      dispatchResetAssignedTree,
      dispatchClearTreeDetails,
      dispatchResetVerification,
      dispatchResetDeleteEvent,
      dispatchResetUserNonce,
      dispatchResetUserSign,
      dispatchResetSearchPlaces,
      dispatchResetPendingTreeIds,
      dispatchResetAll,
      dispatchResetRecentPlaces,
    ],
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
