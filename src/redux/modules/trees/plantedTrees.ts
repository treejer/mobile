import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TPlantedTreesAction, TPlantedTreesPayload, TPlantedTreesRes} from 'webServices/trees/plantedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {PaginationName, TPaginationItem} from 'ranger-redux/modules/pagination/pagination.reducer';
import {TReduxState} from 'ranger-redux/store';

export const PlantedTrees = new ReduxFetchState<TPlantedTreesRes, TPlantedTreesPayload, string>('plantedTrees');

export function* watchPlantedTrees({payload}: TPlantedTreesAction) {
  const {filters, sort = {signer: -1, nonce: -1}, resolve, reject, showError = true} = payload || {};
  try {
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.PlantedTrees));
    const res: FetchResult<TPlantedTreesRes> = yield sagaFetch<TPlantedTreesRes>('/plant_requests/me', {
      configUrl: 'treejerNestApiUrl',
      params: {
        skip: page,
        limit: perPage,
        sort: sort ? JSON.stringify(sort) : undefined,
        filters: filters ? JSON.stringify(filters) : undefined,
      },
    });
    if (res?.result?.count) {
      yield put(setPaginationTotal(PaginationName.PlantedTrees, res?.result?.count));
    }
    const persistedPlantedTrees: TPlantedTreesRes = yield select(getPlantedTrees);
    if (res.result.count === [...(persistedPlantedTrees?.data || []), ...res.result.data].length) {
      yield put(paginationReachedEnd(PaginationName.PlantedTrees));
    }
    yield put(
      PlantedTrees.actions.loadSuccess({
        count: res.result.count,
        data: [...(page === 0 || !persistedPlantedTrees?.data ? [] : persistedPlantedTrees?.data), ...res.result.data],
      }),
    );
    resolve?.();
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(PlantedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e, {showErrorAlert: showError});
    reject?.();
  }
}

export function* plantedTreesSagas() {
  yield takeEvery(PlantedTrees.actionTypes.load, watchPlantedTrees);
}

export const getPlantedTrees = (state: TReduxState) => state.plantedTrees.data;

export const {
  reducer: plantedTreesReducer,
  actions: plantedTreesActions,
  actionTypes: plantedTreesActionTypes,
} = PlantedTrees;
