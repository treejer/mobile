import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put} from 'redux-saga/effects';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {UserSignForm, UserSignRes} from 'services/types';

const UserSign = new ReduxFetchState<UserSignRes, UserSignForm, any>('userSign');

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
    const {signature, wallet} = action.payload || {};

    const res: FetchResult<UserSignRes> = yield sagaFetch<UserSignRes, Pick<UserSignForm, 'signature'>>(
      `/login/${wallet}`,
      {
        configUrl: 'treejerNestApiUrl',
        method: 'POST',
        data: {
          signature,
        },
      },
    );
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

  const dispatchUserSign = useCallback(
    (form: UserSignForm) => {
      dispatch(UserSign.actions.load(form));
    },
    [dispatch],
  );

  const dispatchResetUserSign = useCallback(() => {
    dispatch(UserSign.actions.resetCache());
  }, [dispatch]);

  return {
    userSign: data,
    ...userSignState,
    dispatchUserSign,
    dispatchResetUserSign,
  };
}

export const {actionTypes: userSignActionTypes, actions: userSignActions, reducer: userSignReducer} = UserSign;
