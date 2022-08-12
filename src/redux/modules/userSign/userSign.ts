import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put} from 'redux-saga/effects';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {UserSignForm, UserSignRes} from 'services/types';
import {selectWallet} from 'redux/modules/web3/web3';
import {NetworkConfig} from 'services/config';
import {Method} from 'axios';

const UserSign = new ReduxFetchState<UserSignRes, UserSignForm, string>('userSign');

export type TUserSignAction = {
  type: string;
  payload: UserSignForm;
};

export function* watchUserSign(action: TUserSignAction) {
  const {payload} = action;
  try {
    const wallet = yield selectWallet();
    const options = {
      configUrl: 'treejerApiUrl' as keyof NetworkConfig,
      method: 'PATCH' as Method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({signature: payload.signature}),
    };
    const res: FetchResult<UserSignRes> = yield sagaFetch<UserSignRes>(`/user/sign?publicAddress=${wallet}`, options);
    yield put(UserSign.actions.loadSuccess(res.result));
  } catch (e: any) {
    yield put(UserSign.actions.loadFailure(e));
    yield handleSagaFetchError(e);
  }
}

export function* userSignSagas() {
  yield takeEvery(UserSign.actionTypes.load, watchUserSign);
}

export function useUserSign() {
  const {data, ...userSignState} = useAppSelector(state => state.userSign);
  const dispatch = useAppDispatch();

  const dispatchUserSign = useCallback(() => {
    dispatch(UserSign.actions.load());
  }, [dispatch]);

  return {
    ...userSignState,
    dispatchUserSign,
    userSign: data,
  };
}

export const {actionTypes: userSignActionsTypes, actions: userSignActions, reducer: userSignReducer} = UserSign;
