import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TPlantedTreesAction, TPlantedTreesPayload, TPlantedTreesRes} from 'webServices/trees/plantedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {PaginationName, TPaginationItem} from 'ranger-redux/modules/pagination/pagination.reducer';

export const PlantedTrees = new ReduxFetchState<TPlantedTreesRes, TPlantedTreesPayload, string>('plantedTrees');

export const {
  reducer: plantedTreesReducer,
  actions: plantedTreesActions,
  actionTypes: plantedTreesActionTypes,
} = PlantedTrees;

export function* watchPlantedTrees({payload}: TPlantedTreesAction) {
  try {
    const {filters, sort = {signer: -1, nonce: -1}} = payload || {};
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.PlantedTrees));
    const res: FetchResult<TPlantedTreesRes> = yield sagaFetch<TPlantedTreesRes>('/plant_requests/verification/me', {
      configUrl: 'treejerNestApiUrl',
      params: {
        limit: page * perPage,
        sort: sort ? JSON.stringify(sort) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
      },
    });
    yield put(setPaginationTotal(PaginationName.PlantedTrees, res.result.count));
    if (res.result.count === res.result.data.length) {
      yield put(paginationReachedEnd(PaginationName.PlantedTrees));
    }
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
