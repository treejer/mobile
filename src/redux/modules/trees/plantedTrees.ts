import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {TPlantedTreesRes} from 'webServices/trees/plantedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';

export const PlantedTrees = new ReduxFetchState<TPlantedTreesRes, null, string>('plantedTrees');

export function* watchPlantedTrees() {
  try {
    const res: FetchResult<TPlantedTreesRes> = yield sagaFetch<TPlantedTreesRes>('/plant_requests/verification/me');
    yield put(PlantedTrees.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(PlantedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* plantedTreesSagas() {
  yield takeEvery(PlantedTrees.actionTypes.load, watchPlantedTrees);
}

export const {
  reducer: plantedTreesReducer,
  actions: plantedTreesActions,
  actionTypes: plantedTreesActionTypes,
} = PlantedTrees;
