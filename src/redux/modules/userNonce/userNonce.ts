import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put} from 'redux-saga/effects';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {UserNonceRes} from 'services/types';
import {selectWallet} from 'redux/modules/web3/web3';

const UserNonce = new ReduxFetchState<UserNonceRes, null, string>('userNonce');

export function* watchUserNonce() {
  try {
    const wallet = yield selectWallet();
    const res: FetchResult<UserNonceRes> = yield sagaFetch<UserNonceRes>(`/user/nonce?publicAddress=${wallet}`);
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
