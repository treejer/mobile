import * as assert from 'assert';
import {put, take, takeEvery} from 'redux-saga/effects';

import {
  deleteTreeEventActionTypes,
  deleteTreeEventActions,
  deleteTreeEventReducer,
  deleteTreeEventSagas,
  watchDeleteTreeEvent,
} from 'ranger-redux/modules/submitTreeEvents/deleteTreeEvent';
import {DeleteResMock} from 'ranger-redux/modules/__test__/submitTreeEvents/deleteTreeEvent.mock';
import {assignedTreeActionTypes} from 'ranger-redux/modules/submitTreeEvents/assignedTree';
import {pendingTreeIdsActions, pendingTreeIdsActionTypes} from 'ranger-redux/modules/trees/pendingTreeIds';
import {handleSagaFetchError, sagaFetch} from 'utilities/helpers/fetch';
import {Hex2Dec} from 'utilities/helpers/hex';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {NotVerifiedTreeStatus} from 'utilities/helpers/treeInventory';
import {plantedTreesActions, plantedTreesActionTypes} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesActions, updatedTreesActionTypes} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesActions, assignedTreesActionTypes} from 'ranger-redux/modules/trees/assignedTrees';

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
      assert.deepEqual(
        gen.next().value,
        takeEvery(deleteTreeEventActionTypes.load, watchDeleteTreeEvent),
        'should yield watchDeleteTreeEvent',
      );
    });
  });

  describe('watchDeleteTreeEvent', () => {
    it('watchDeleteTreeEvent should be defined', () => {
      expect(watchDeleteTreeEvent).toBeDefined();
    });

    it('watchDeleteTreeEvent success (Delete Plant Request)', () => {
      const gen = watchDeleteTreeEvent({
        type: deleteTreeEventActionTypes.load,
        payload: {event: NotVerifiedTreeStatus.Plant, id: '11221'},
      });
      assert.deepEqual(
        gen.next().value,
        sagaFetch(`/${NotVerifiedTreeStatus.Plant.toString().toLowerCase()}_requests/11221`, {
          configUrl: 'treejerNestApiUrl',
          method: 'DELETE',
        }),
        'url should be /plant_requests/11221',
      );

      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(plantedTreesActions.load()),
        'should dispatch plantedTreeActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        take([plantedTreesActionTypes.loadSuccess, plantedTreesActionTypes.loadFailure]),
        'should wait for the result of plantedTreesActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        showSagaAlert({
          title: '',
          message: DeleteResMock,
          mode: AlertMode.Success,
        }),
        'should show success alert',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(deleteTreeEventActions.loadSuccess(DeleteResMock)),
        'should dispatch deleteTreeEventActions success',
      );
    });
    it('watchDeleteTreeEvent success (Delete Update Request)', () => {
      const gen = watchDeleteTreeEvent({
        type: deleteTreeEventActionTypes.load,
        payload: {event: NotVerifiedTreeStatus.Update, id: '11221'},
      });
      assert.deepEqual(
        gen.next().value,
        sagaFetch(`/${NotVerifiedTreeStatus.Update.toString().toLowerCase()}_requests/11221`, {
          configUrl: 'treejerNestApiUrl',
          method: 'DELETE',
        }),
        'url should be /update_requests/11221',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(updatedTreesActions.load()),
        'should dispatch updatedTreesActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        take([updatedTreesActionTypes.loadSuccess, updatedTreesActionTypes.loadFailure]),
        'should wait for the result of updatedTreesActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        showSagaAlert({
          title: '',
          message: DeleteResMock,
          mode: AlertMode.Success,
        }),
        'should show success alert',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(deleteTreeEventActions.loadSuccess(DeleteResMock)),
        'should dispatch deleteTreeEventActions success',
      );
    });
    it('watchDeleteTreeEvent success (Delete Assigned Request)', () => {
      const gen = watchDeleteTreeEvent({
        type: deleteTreeEventActionTypes.load,
        payload: {event: NotVerifiedTreeStatus.Assigned, id: '11221'},
      });
      assert.deepEqual(
        gen.next().value,
        sagaFetch(`/${NotVerifiedTreeStatus.Assigned.toString().toLowerCase()}_requests/${Hex2Dec('11221')}`, {
          configUrl: 'treejerNestApiUrl',
          method: 'DELETE',
        }),
        'url should be /assigned_requests/11221',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(pendingTreeIdsActions.load()),
        'should dispatch pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        take([pendingTreeIdsActionTypes.loadSuccess, pendingTreeIdsActionTypes.loadFailure]),
        'should wait for the result of pendingTreeIdsActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(assignedTreesActions.load()),
        'should dispatch assignedTreesActions load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        take([assignedTreesActionTypes.loadSuccess, assignedTreesActionTypes.loadFailure]),
        'should wait for the result of assignedTreesActionTypes load action',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        showSagaAlert({
          title: '',
          message: DeleteResMock,
          mode: AlertMode.Success,
        }),
        'should show success alert',
      );
      assert.deepEqual(
        gen.next({result: DeleteResMock, status: 204}).value,
        put(deleteTreeEventActions.loadSuccess(DeleteResMock)),
        'should dispatch deleteTreeEventActions success',
      );
    });

    it('watchDeleteTreeEvent failure', () => {
      const gen = watchDeleteTreeEvent({
        type: assignedTreeActionTypes.load,
        payload: {
          event: NotVerifiedTreeStatus.Plant,
          id: '0000',
        },
      });
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        put(deleteTreeEventActions.loadFailure(error.message)),
        'should dispatch deleteTreeEventActions failure',
      );
      assert.deepEqual(gen.next().value, handleSagaFetchError(error as any));
    });
  });
});
