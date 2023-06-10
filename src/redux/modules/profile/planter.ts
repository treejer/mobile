import {useCallback, useEffect} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TPlanterRes} from 'webServices/profile/planter';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {getProfile} from 'ranger-redux/modules/profile/profile';
import {TProfile} from 'webServices/profile/profile';

export const Planter = new ReduxFetchState<TPlanterRes, null, string>('planter');

export function* watchPlanter() {
  try {
    const {_id}: TProfile = yield select(getProfile);
    const res: FetchResult<TPlanterRes> = yield sagaFetch<TPlanterRes>(`/graph/planter/${_id}`);
    yield put(Planter.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(Planter.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* planterSagas() {
  yield takeEvery(Planter.actionTypes.load, watchPlanter);
}

export function usePlanter(fetchOnMount?: boolean) {
  const {data: planter, ...planterState} = useAppSelector(state => state.planter);
  const dispatch = useAppDispatch();

  const dispatchGetPlanter = useCallback(() => {
    dispatch(Planter.actions.load());
  }, [dispatch]);

  useEffect(() => {
    if (fetchOnMount) {
      dispatchGetPlanter();
    }
  }, []);

  return {
    planter,
    ...planterState,
    dispatchGetPlanter,
  };
}

export const {reducer: planterReducer, actions: planterActions, actionTypes: planterActionTypes} = Planter;
