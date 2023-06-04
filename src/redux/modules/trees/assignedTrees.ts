import ReduxFetchState from 'redux-fetch-state';
import {put, select, takeEvery} from 'redux-saga/effects';

import {TAssignedTreesAction, TAssignedTreesPayload, TAssignedTreesRes} from 'webServices/trees/assignedTrees';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {PaginationName, TPaginationItem} from 'ranger-redux/modules/pagination/pagination.reducer';
import {paginationReachedEnd, setPaginationTotal} from 'ranger-redux/modules/pagination/pagination.action';
import {getPaginationByName} from 'ranger-redux/modules/pagination/pagination.saga';

const AssignedTrees = new ReduxFetchState<TAssignedTreesRes, TAssignedTreesPayload, string>('assignedTrees');

export function* watchAssignedTrees({payload}: TAssignedTreesAction) {
  try {
    const {filters, sort = {signer: -1, nonce: -1}} = payload || {};
    const {page, perPage}: TPaginationItem = yield select(getPaginationByName(PaginationName.AssignedTrees));
    const res: FetchResult<TAssignedTreesRes> = yield sagaFetch<TAssignedTreesRes>(
      '/assigned_requests/verification/me',
      {
        configUrl: 'treejerNestApiUrl',
        params: {
          limit: page * perPage,
          filters: filters ? JSON.stringify(filters) : undefined,
          sort: sort ? JSON.stringify(sort) : undefined,
        },
      },
    );
    yield put(setPaginationTotal(PaginationName.AssignedTrees, res.result.count));
    if (res.result.count === res.result.data.length) {
      yield put(paginationReachedEnd(PaginationName.AssignedTrees));
    }
    yield put(AssignedTrees.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(AssignedTrees.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* assignedTreesSagas() {
  yield takeEvery(AssignedTrees.actionTypes.load, watchAssignedTrees);
}

export const {
  reducer: assignedTreesReducer,
  actions: assignedTreesActions,
  actionTypes: assignedTreesActionTypes,
} = AssignedTrees;
