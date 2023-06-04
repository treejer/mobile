import {put, select, takeEvery} from 'redux-saga/effects';

import {TReduxState} from 'ranger-redux/store';
import {PaginationName, PaginationNameFetcher, TPaginationAction, TPaginationItem} from './pagination.reducer';
import * as actionsList from './pagination.action';

export const getPaginationByName = (name: PaginationName) => (state: TReduxState) => state.pagination[name];

export function* watchSetNextPage({name}: TPaginationAction) {
  try {
    const {hasMore}: TPaginationItem = yield select(getPaginationByName(name));
    if (hasMore) {
      const action = PaginationNameFetcher[name];
      if (action) {
        yield put(action());
      }
    }
  } catch (e) {
    console.log(e, 'e is here watchSetNextPage');
  }
}

export function* paginationSagas() {
  yield takeEvery(actionsList.SET_NEXT_PAGE, watchSetNextPage);
}
