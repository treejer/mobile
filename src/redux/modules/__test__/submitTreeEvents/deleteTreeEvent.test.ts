import * as assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';

import {
  deleteTreeEventActionTypes,
  deleteTreeEventActions,
  deleteTreeEventReducer,
  deleteTreeEventSagas,
  watchDeleteTreeEvent,
} from 'ranger-redux/modules/submitTreeEvents/deleteTreeEvent';
import {DeleteTreeEvents} from 'webServices/submitTreeEvents/deleteTreeEvent';
import {handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {Hex2Dec} from 'utilities/helpers/hex';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {DeleteResMock} from 'ranger-redux/modules/__test__/submitTreeEvents/deleteTreeEvent.mock';
import {assignedTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/assignedTree';

describe('deleteTreeEvent', () => {
  it('deleteTreeEvent module should be defined', () => {
    expect(deleteTreeEventReducer).toBeDefined();
    expect(deleteTreeEventActions).toBeDefined();
    expect(deleteTreeEventActionTypes).toBeDefined();
  });

  describe('deleteTreeEvents sagas', () => {
    it('deleteTreeEvent sagas should be defined', () => {
      expect(deleteTreeEventSagas).toBeDefined();
    });
    it('should yield deleteTreeEvent watcher', () => {
      const gen = deleteTreeEventSagas();
      assert.deepEqual(gen.next().value, takeEvery(deleteTreeEventActionTypes.load, watchDeleteTreeEvent));
    });
  });

  describe('watchDeleteTreeEvent', () => {
    it('watchDeleteTreeEvent should be defined', () => {
      expect(watchDeleteTreeEvent).toBeDefined();
    });

    it('watchDeleteTreeEvent success (Delete Plant Request)', () => {
      const gen = watchDeleteTreeEvent({
        type: deleteTreeEventActionTypes.load,
        payload: {event: DeleteTreeEvents.Plant, id: '11221'},
      });
      assert.deepEqual(
        gen.next().value,
        sagaFetch(`/${DeleteTreeEvents.Plant.toString().toLowerCase()}_requests/${Hex2Dec('11221')}`),
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        showSagaAlert({
          title: '',
          message: DeleteResMock,
          mode: AlertMode.Success,
        }),
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(deleteTreeEventActions.loadSuccess(DeleteResMock)),
      );
    });
    it('watchDeleteTreeEvent success (Delete Update Request)', () => {
      const gen = watchDeleteTreeEvent({
        type: deleteTreeEventActionTypes.load,
        payload: {event: DeleteTreeEvents.Update, id: '11221'},
      });
      assert.deepEqual(
        gen.next().value,
        sagaFetch(`/${DeleteTreeEvents.Update.toString().toLowerCase()}_requests/${Hex2Dec('11221')}`),
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        showSagaAlert({
          title: '',
          message: DeleteResMock,
          mode: AlertMode.Success,
        }),
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(deleteTreeEventActions.loadSuccess(DeleteResMock)),
      );
    });
    it('watchDeleteTreeEvent success (Delete Assigned Request)', () => {
      const gen = watchDeleteTreeEvent({
        type: deleteTreeEventActionTypes.load,
        payload: {event: DeleteTreeEvents.Assigned, id: '11221'},
      });
      assert.deepEqual(
        gen.next().value,
        sagaFetch(`/${DeleteTreeEvents.Assigned.toString().toLowerCase()}_requests/${Hex2Dec('11221')}`),
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        showSagaAlert({
          title: '',
          message: DeleteResMock,
          mode: AlertMode.Success,
        }),
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(deleteTreeEventActions.loadSuccess(DeleteResMock)),
      );
    });

    it('watchDeleteTreeEvent failure', () => {
      const gen = watchDeleteTreeEvent({
        type: assignedTreeActionTypes.load,
        payload: {
          event: DeleteTreeEvents.Plant,
          id: '0000',
        },
      });
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(deleteTreeEventActions.loadFailure(error.message)));
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
