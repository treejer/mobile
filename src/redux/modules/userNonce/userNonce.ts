import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put} from 'redux-saga/effects';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {UserNonceForm, UserNonceRes} from 'services/types';

const UserNonce = new ReduxFetchState<UserNonceRes, UserNonceForm, string>('userNonce');

export type TUserNonceAction = {
  type: string;
  payload: UserNonceForm;
};

export type TUserNonceSuccessAction = {
  type: string;
  payload: UserNonceRes;
};

export function* watchUserNonce(action: TUserNonceAction) {
  try {
    const {wallet, magicToken, loginData} = action.payload;

    const searchParams = new URLSearchParams();
    // searchParams.set('wallet', wallet);
    searchParams.set('token', magicToken);

    if (loginData?.email) {
      searchParams.set('email', loginData.email);
    }
    if (loginData?.mobile && loginData?.country) {
      searchParams.set('mobile', loginData.mobile);
      searchParams.set('country', loginData.country);
    }
    const res: FetchResult<UserNonceRes> = yield sagaFetch<UserNonceRes>(`/nonce/${wallet}?${searchParams.toString()}`);
    yield put(UserNonce.actions.loadSuccess(res.result));
  } catch (e: any) {
    yield put(UserNonce.actions.loadFailure(e));
    yield handleSagaFetchError(e);
  }
}

export function* userNonceSagas() {
  yield takeEvery(UserNonce.actionTypes.load, watchUserNonce);
}

export function useUserNonce() {
  const {data, ...userNonceState} = useAppSelector(state => state.userNonce);
  const dispatch = useAppDispatch();

  const dispatchUserNonce = useCallback(() => {
    dispatch(UserNonce.actions.load());
  }, [dispatch]);

  return {
    ...userNonceState,
    dispatchUserNonce,
    userNonce: data,
  };
}

export const {actionTypes: userNonceActionsTypes, actions: userNonceActions, reducer: userNonceReducer} = UserNonce;
