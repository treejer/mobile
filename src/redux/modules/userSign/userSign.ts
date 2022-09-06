import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put} from 'redux-saga/effects';
import {Method} from 'axios';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {UserSignForm, UserSignRes} from 'services/types';
import {NetworkConfig} from 'services/config';

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

    const options = {
      configUrl: 'treejerApiUrl' as keyof NetworkConfig,
      method: 'PATCH' as Method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({signature}),
    };

    const res: FetchResult<UserSignRes> = yield sagaFetch<UserSignRes>(`/user/sign?publicAddress=${wallet}`, options);
    console.log(res, 'response in user sign');
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
