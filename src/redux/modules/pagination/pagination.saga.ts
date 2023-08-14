import {put, select, takeEvery} from 'redux-saga/effects';

import {TReduxState} from 'ranger-redux/store';
import {PaginationName, TPaginationAction, TPaginationItem} from './pagination.reducer';
import * as actionsList from './pagination.action';

export const getPaginationByName = (name: PaginationName) => (state: TReduxState) => state.pagination[name];

export function* watchSetNextPage({name, action, query}: TPaginationAction) {
  try {
    const {hasMore}: TPaginationItem = yield select(getPaginationByName(name));
    if (hasMore) {
      if (action) {
        yield put(action(query));
      }
    }
  } catch (e) {
    console.log(e, 'e is here watchSetNextPage');
  }
}

export function* paginationSagas() {
  yield takeEvery(actionsList.SET_NEXT_PAGE, watchSetNextPage);
}
