import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put} from 'redux-saga/effects';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

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
    yield put(Profile.actions.loadSuccess(res.result));
  } catch (e: any) {
    yield put(Profile.actions.loadFailure(e));
    yield handleSagaFetchError(e);
  }
}

export function* profileSagas() {
  yield takeEvery(Profile.actionTypes.load, watchProfile);
}

export function useProfile() {
  const {data, ...profileState} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  const dispatchProfile = useCallback(() => {
    dispatch(Profile.actions.load());
  }, [dispatch]);

  return {
    ...profileState,
    dispatchProfile,
    profile: data,
  };
}

export const {actionTypes: profileActionsTypes, actions: profileActions, reducer: profileReducer} = Profile;
