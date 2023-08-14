import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {
  TAssignedTreeAction,
  TAssignedTreeForm,
  TAssignedTreePayload,
  TAssignedTreeRes,
} from 'webServices/submitTreeEvents/assignedTree';
import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {setSubmitJourneyLoading} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

const AssignedTree = new ReduxFetchState<TAssignedTreeRes, TAssignedTreePayload, string | string[]>('assignedTree');

export function* watchAssignedTree({payload}: TAssignedTreeAction) {
  try {
    const {treeId, treeSpecs, treeSpecsJSON, signature, birthDate} = payload || {};
    const res: FetchResult<TAssignedTreeRes> = yield sagaFetch<TAssignedTreeRes, TAssignedTreeForm>(
      '/assigned_requests',
      {
        configUrl: 'treejerNestApiUrl',
        method: 'POST',
        data: {
          treeId,
          treeSpecs,
          treeSpecsJSON,
          signature,
          birthDate,
          countryCode: 0,
        },
      },
    );
    yield put(AssignedTree.actions.loadSuccess(res.result));
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(AssignedTree.actions.loadFailure(message));
    yield put(setSubmitJourneyLoading(false));
    yield handleSagaFetchError(e, {logoutUnauthorized: false});
  }
}

export function* assignedTreeSagas() {
  yield takeEvery(AssignedTree.actionTypes.load, watchAssignedTree);
}

export function useAssignedTree() {
  const {data: assignedTree, ...assignedTreeState} = useAppSelector(state => state.assignedTree);
  const dispatch = useAppDispatch();

  const dispatchAssignedTree = useCallback(
    (form: TAssignedTreePayload) => {
      dispatch(AssignedTree.actions.load(form));
    },
    [dispatch],
  );

  const dispatchResetAssignedTree = useCallback(() => {
    dispatch(AssignedTree.actions.resetCache());
  }, [dispatch]);

  return {
    assignedTree,
    ...assignedTreeState,
    dispatchAssignedTree,
    dispatchResetAssignedTree,
  };
}

export const {
  reducer: assignedTreeReducer,
  actions: assignedTreeActions,
  actionTypes: assignedTreeActionTypes,
} = AssignedTree;
