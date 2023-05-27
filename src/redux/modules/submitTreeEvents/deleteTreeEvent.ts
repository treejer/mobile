import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {put, takeEvery} from 'redux-saga/effects';

import {FetchResult, handleFetchError, handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {
  DeleteTreeEvents,
  TDeleteTreeEventAction,
  TDeleteTreeEventPayload,
  TDeleteTreeEventRes,
} from 'webServices/submitTreeEvents/deleteTreeEvent';
import {TReduxState} from 'ranger-redux/store';
import {Hex2Dec} from 'utilities/helpers/hex';

const DeleteTreeEvent = new ReduxFetchState<TDeleteTreeEventRes, TDeleteTreeEventPayload, string>('deleteTreeEvent');

export function* watchDeleteTreeEvent({payload}: TDeleteTreeEventAction) {
  try {
    const {id, event} = payload || {};
    const res: FetchResult<TDeleteTreeEventRes> = yield sagaFetch<TDeleteTreeEventRes>(
      `/${event.toString().toLowerCase()}_requests/${Hex2Dec(id)}`,
      {
        configUrl: 'treejerNestApiUrl',
        method: 'DELETE',
      },
    );
    yield showSagaAlert({
      title: '',
      message: res.result,
      mode: AlertMode.Success,
    });
    yield put(DeleteTreeEvent.actions.loadSuccess(res.result));
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
      dispatch(DeleteTreeEvent.actions.load({event: DeleteTreeEvents.Plant, id}));
    },
    [dispatch],
  );

  const dispatchDeleteAssignedEvent = useCallback(
    (id: string) => {
      dispatch(DeleteTreeEvent.actions.load({event: DeleteTreeEvents.Assigned, id}));
    },
    [dispatch],
  );

  const dispatchDeleteUpdateEvent = useCallback(
    (id: string) => {
      dispatch(DeleteTreeEvent.actions.load({event: DeleteTreeEvents.Update, id}));
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
