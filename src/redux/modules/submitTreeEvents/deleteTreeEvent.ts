import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, take, takeEvery} from 'redux-saga/effects';
import {CommonActions} from '@react-navigation/native';

import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {
  TDeleteTreeEventAction,
  TDeleteTreeEventPayload,
  TDeleteTreeEventRes,
} from 'webServices/submitTreeEvents/deleteTreeEvent';
import {Routes} from 'navigation/Navigation';
import {NotVerifiedTreeStatus, TreeLife} from 'utilities/helpers/treeInventory';
import {navigationRef} from 'navigation/navigationRef';
import {pendingTreeIdsActions, pendingTreeIdsActionTypes} from 'ranger-redux/modules/trees/pendingTreeIds';
import {plantedTreesActions, plantedTreesActionTypes} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesActions, updatedTreesActionTypes} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesActions, assignedTreesActionTypes} from 'ranger-redux/modules/trees/assignedTrees';
import {TReduxState} from 'ranger-redux/store';

const DeleteTreeEvent = new ReduxFetchState<TDeleteTreeEventRes, TDeleteTreeEventPayload, string>('deleteTreeEvent');

export function* watchDeleteTreeEvent({payload}: TDeleteTreeEventAction) {
  try {
    const {id, event} = payload || {};
    const res: FetchResult<TDeleteTreeEventRes> = yield sagaFetch<TDeleteTreeEventRes>(
      `/${event.toString().toLowerCase()}_requests/${id}`,
      {
        configUrl: 'treejerNestApiUrl',
        method: 'DELETE',
      },
    );
    yield put(pendingTreeIdsActions.load());
    yield take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]);
    if (event === NotVerifiedTreeStatus.Plant) {
      yield put(plantedTreesActions.load());
      yield take([plantedTreesActionTypes.loadSuccess, plantedTreesActionTypes.loadFailure]);
    } else if (event === NotVerifiedTreeStatus.Update) {
      yield put(updatedTreesActions.load());
      yield take([updatedTreesActionTypes.loadSuccess, updatedTreesActionTypes.loadFailure]);
    } else {
      yield put(assignedTreesActions.load());
      yield take([assignedTreesActionTypes.loadSuccess, assignedTreesActionTypes.loadFailure]);
    }
    yield showSagaAlert({
      title: '',
      message: 'responseCodeMessage.204',
      mode: AlertMode.Success,
      alertOptions: {
        translate: true,
      },
    });
    yield put(DeleteTreeEvent.actions.loadSuccess(res.result));
    navigationRef()?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.GreenBlock,
            params: {
              tabFilter: TreeLife.NotVerified,
              notVerifiedFilter: [event],
            },
          },
        ],
      }),
    );
  } catch (e: any) {
    const {message} = handleFetchError(e);
    yield put(DeleteTreeEvent.actions.loadFailure(message));
    yield handleSagaFetchError(e);
  }
}

export function* deleteTreeEventSagas() {
  yield takeEvery(DeleteTreeEvent.actionTypes.load, watchDeleteTreeEvent);
}

export function useDeleteTreeEvent() {
  const {data: deleteTreeEvent, ...deleteTreeEventState} = useAppSelector(
    (state: TReduxState) => state.deleteTreeEvent,
  );
  const dispatch = useAppDispatch();

  const dispatchDeletePlantEvent = useCallback(
    (id: string) => {
      dispatch(DeleteTreeEvent.actions.load({event: NotVerifiedTreeStatus.Plant, id}));
    },
    [dispatch],
  );

  const dispatchDeleteAssignedEvent = useCallback(
    (id: string) => {
      dispatch(DeleteTreeEvent.actions.load({event: NotVerifiedTreeStatus.Assigned, id}));
    },
    [dispatch],
  );

  const dispatchDeleteUpdateEvent = useCallback(
    (id: string) => {
      dispatch(DeleteTreeEvent.actions.load({event: NotVerifiedTreeStatus.Update, id}));
    },
    [dispatch],
  );

  return {
    ...deleteTreeEventState,
    deleteTreeEvent,
    dispatchDeletePlantEvent,
    dispatchDeleteAssignedEvent,
    dispatchDeleteUpdateEvent,
  };
}

export const {
  reducer: deleteTreeEventReducer,
  actions: deleteTreeEventActions,
  actionTypes: deleteTreeEventActionTypes,
} = DeleteTreeEvent;
