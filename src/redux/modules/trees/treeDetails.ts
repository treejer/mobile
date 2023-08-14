import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TTreeDetailAction, TTreeDetailPayload, TTreeDetailRes} from 'webServices/trees/treeDetail';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {Hex2Dec} from 'utilities/helpers/hex';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export const TreeDetails = new ReduxFetchState<TTreeDetailRes, TTreeDetailPayload, string>('treeDetail');

export function* watchTreeDetails({payload}: TTreeDetailAction) {
  const {id, inSubmission} = payload || {};
  try {
    const res: FetchResult<TTreeDetailRes> = yield sagaFetch<TTreeDetailRes>(`/trees/${Hex2Dec(id)}`);
    yield put(TreeDetails.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(TreeDetails.actions.loadFailure(message));
    if (inSubmission) {
      yield put(setSubmitJourneyLoading(false));
    }
    yield handleSagaFetchError(e);
  }
}

export function* treeDetailsSagas() {
  yield takeEvery(TreeDetails.actionTypes.load, watchTreeDetails);
}

export function useTreeDetails() {
  const {data: treeDetails, ...treeDetailsState} = useAppSelector(state => state.treeDetails);
  const dispatch = useAppDispatch();

  const dispatchGetTreeDetails = useCallback(
    (id: string) => {
      dispatch(TreeDetails.actions.load({id}));
    },
    [dispatch],
  );

  const dispatchClearTreeDetails = useCallback(() => {
    dispatch(TreeDetails.actions.resetCache());
  }, [dispatch]);

  return {
    treeDetails,
    ...treeDetailsState,
    dispatchGetTreeDetails,
    dispatchClearTreeDetails,
  };
}

export const {
  reducer: treeDetailsReducer,
  actions: treeDetailsActions,
  actionTypes: treeDetailsActionTypes,
} = TreeDetails;
