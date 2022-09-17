import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, call} from 'redux-saga/effects';
import axios, {Method} from 'axios';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {UserSignForm, UserSignRes} from 'services/types';
import {NetworkConfig} from 'services/config';
import {selectConfig} from '../web3/web3';

const UserSign = new ReduxFetchState<UserSignRes, UserSignForm, string>('userSign');

export type TUserSignAction = {
  type: string;
  payload: UserSignForm;
};

export type TUserSignSuccessAction = {
  type: string;
  payload: UserSignRes;
};

export function* watchUserSign(action: TUserSignAction) {
  try {
    const {signature, wallet} = action.payload;
    const {treejerApiUrl}: NetworkConfig = yield selectConfig();

    const options = {
      // configUrl: 'treejerApiUrl' as keyof NetworkConfig,
      method: 'PATCH' as Method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({signature}),
    };

    const res = yield call(() => fetch(`${treejerApiUrl}/user/sign?publicAddress=${wallet}`, options));
    const data = yield res.json();
    yield put(UserSign.actions.loadSuccess(data));
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
