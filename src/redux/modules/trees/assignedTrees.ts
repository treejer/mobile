import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TAssignedTreesAction, TAssignedTreesPayload, TAssignedTreesRes} from 'webServices/trees/assignedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {PaginationName, TPaginationItem} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';
import {TReduxState} from 'ranger-redux/store';

const AssignedTrees = new ReduxFetchState<TAssignedTreesRes, TAssignedTreesPayload, string>('assignedTrees');

export function* watchAssignedTrees({payload}: TAssignedTreesAction) {
  const {filters, sort = {signer: -1, nonce: -1}, reject, resolve} = payload || {};
  try {
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.AssignedTrees));
    const res: FetchResult<TAssignedTreesRes> = yield sagaFetch<TAssignedTreesRes>('/assigned_requests/me', {
      configUrl: 'treejerNestApiUrl',
      params: {
        skip: page,
        limit: perPage,
        filters: filters ? JSON.stringify(filters) : undefined,
        sort: sort ? JSON.stringify(sort) : undefined,
      },
    });
    if (res?.result?.count) {
      yield put(setPaginationTotal(PaginationName.AssignedTrees, res.result.count));
    }
    const persistedAssignedTrees: TAssignedTreesRes = yield select(getAssignedTrees);
    if (res.result.count === [...(persistedAssignedTrees?.data || []), ...res.result.data].length) {
      yield put(paginationReachedEnd(PaginationName.AssignedTrees));
    }
    yield put(
      AssignedTrees.actions.loadSuccess({
        ...res.result,
        data: [
          ...(page === 0 || !persistedAssignedTrees?.data ? [] : persistedAssignedTrees?.data),
          ...res.result.data,
        ],
      }),
    );
    resolve?.();
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(AssignedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
    reject?.();
  }
}

export function* assignedTreesSagas() {
  yield takeEvery(AssignedTrees.actionTypes.load, watchAssignedTrees);
}

export const getAssignedTrees = (state: TReduxState) => state.assignedTrees.data;

export const {
  reducer: assignedTreesReducer,
  actions: assignedTreesActions,
  actionTypes: assignedTreesActionTypes,
} = AssignedTrees;
