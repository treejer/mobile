import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TTreeDetailAction, TTreeDetailPayload, TTreeDetailRes} from 'webServices/trees/treeDetail';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {Hex2Dec} from 'utilities/helpers/hex';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';

export const TreeDetail = new ReduxFetchState<TTreeDetailRes, TTreeDetailPayload, string>('treeDetail');

export function* watchTreeDetail({payload}: TTreeDetailAction) {
  const {id, inSubmission} = payload || {};
  try {
    const res: FetchResult<TTreeDetailRes> = yield sagaFetch<TTreeDetailRes>(`/trees/${Hex2Dec(id)}`);
    yield put(TreeDetail.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(TreeDetail.actions.loadFailure(message));
    if (inSubmission) {
      yield put(setSubmitJourneyLoading(false));
    }
    yield handleSagaFetchError(e);
  }
}

export function* treeDetailSagas() {
  yield takeEvery(TreeDetail.actionTypes.load, watchTreeDetail);
}

export const {reducer: treeDetailReducer, actions: treeDetailActions, actionTypes: treeDetailActionTypes} = TreeDetail;
