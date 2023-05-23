import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {
  TPlantTreeAction,
  TPlantTreeForm,
  TPlantTreePayload,
  TPlantTreeRes,
} from 'webServices/submitTreeEvents/plantTree';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';

const PlantTree = new ReduxFetchState<TPlantTreeRes, TPlantTreePayload, string | string[]>('plantTree');

export function* watchPlantTree({payload}: TPlantTreeAction) {
  try {
    const {treeSpecs, signature, birthDate} = payload || {};

    const res: FetchResult<TPlantTreeRes> = yield sagaFetch<TPlantTreeRes, TPlantTreeForm>('/plant_requests', {
      configUrl: 'treejerNestApiUrl',
      method: 'POST',
      data: {
        treeSpecs,
        signature,
        birthDate,
        countryCode: 0,
      },
    });
    yield put(PlantTree.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(PlantTree.actions.loadFailure(message));
    yield put(setSubmitJourneyLoading(false));
    yield handleSagaFetchError(e, {logoutUnauthorized: false});
  }
}

export function* plantTreeSagas() {
  yield takeEvery(PlantTree.actionTypes.load, watchPlantTree);
}

export const {reducer: plantTreeReducer, actions: plantTreeActions, actionTypes: plantTreeActionTypes} = PlantTree;
