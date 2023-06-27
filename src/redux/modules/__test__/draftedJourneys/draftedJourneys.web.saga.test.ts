import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {onBoardingOne} from '../../../../../assets/images';
import {photoToBase64} from 'utilities/helpers/photoToBase64';
import getCroppedImg from 'utilities/helpers/cropImage';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {
  draftedJourneysSagas,
  getDraftedJourneys,
  watchDraftJourney,
  watchSaveDraftedJourney,
  watchSetDraftAsCurrentJourney,
} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';

jest.mock('../../../../utilities/helpers/web', () => {
  return {
    isWeb: () => true,
  };
});

describe('draftedJourneys sagas web', () => {
  it('draftedJourneys sagas web module should be defined', () => {
    expect(draftedJourneysSagas).toBeDefined();
    expect(watchSetDraftAsCurrentJourney).toBeDefined();
    expect(watchDraftJourney).toBeDefined();
    expect(watchSaveDraftedJourney).toBeDefined();
  });

  it('draftedJourneysSaga', () => {
    const gen = draftedJourneysSagas();
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.DRAFT_JOURNEY_WATCHER, watchDraftJourney),
      'should yield takeEvery draftJourney watcher',
    );
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.SAVE_DRAFTED_JOURNEY_WATCHER, watchSaveDraftedJourney),
      'should yield takeEvery saveDraftedJourney watcher',
    );
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER, watchSetDraftAsCurrentJourney),
      'should yield takeEvery setDraftAsCurrentJourney watcher',
    );
  });

  it('watchDraftJourney', () => {
    const date = new Date(jest.now());
    const draft = {
      draftType: DraftType.Draft,
      id: date.toString(),
      name: 'Name',
      journey: {
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
    };
    const gen = watchDraftJourney({type: actionsList.DRAFT_JOURNEY_WATCHER, ...draft});
    assert.deepEqual(gen.next().value, photoToBase64(draft.journey.photo), 'generate base 64');
    assert.deepEqual(
      gen.next('base 64 generated').value,
      put(
        actionsList.draftJourney({
          ...draft,
          journeyImageB64: 'base 64 generated',
        }),
      ),
      'should yield put draft journey action',
    );
  });
  it('watchDraftJourney error', () => {
    const date = new Date(jest.now());
    const draft = {
      draftType: DraftType.Draft,
      id: date.toString(),
      name: 'Name',
      journey: {
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
    };
    const gen = watchDraftJourney({type: actionsList.DRAFT_JOURNEY_WATCHER, ...draft});
    const error = new Error('error is here!');
    gen.next();
    assert.deepEqual(
      gen.throw(error).value,
      showSagaAlert({
        message: error.message,
        mode: AlertMode.Error,
      }),
      'should yield saga Alert',
    );
  });
  it('watchSaveDraftedJourney', () => {
    const draft = {
      draftType: DraftType.Draft,
      name: 'Name',
      journey: {
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
    };
    const gen = watchSaveDraftedJourney({type: actionsList.DRAFT_JOURNEY_WATCHER, ...draft});
    assert.deepEqual(gen.next().value, photoToBase64(draft.journey.photo), 'generate base 64');
    assert.deepEqual(
      gen.next('base 64 generated').value,
      put(
        actionsList.saveDraftedJourney({
          ...draft,
          journeyImageB64: 'base 64 generated',
        }),
      ),
      'should yield put save drafted journey action',
    );
  });
  it('watchSaveDraftedJourney error', () => {
    const draft = {
      draftType: DraftType.Draft,
      name: 'Name',
      journey: {
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
    };
    const gen = watchSaveDraftedJourney({type: actionsList.DRAFT_JOURNEY_WATCHER, ...draft});
    gen.next();
    const error = new Error('error is here!');
    assert.deepEqual(
      gen.throw(error).value,
      showSagaAlert({
        message: error.message,
        mode: AlertMode.Error,
      }),
      'should yield sagaAlert',
    );
  });
  it('watchSetAsCurrentJourney', () => {
    const date = new Date(jest.now());
    const draft = {
      id: date.toString(),
      draftType: DraftType.Draft,
      name: 'Name',
      journey: JSON.stringify({
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      }),
      journeyImageB64: 'base 64 generated',
    };
    const drafts = [draft];
    const gen = watchSetDraftAsCurrentJourney({type: actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER, id: draft.id});
    assert.deepEqual(gen.next().value, select(getDraftedJourneys), 'should select draftedJourneys');
    assert.deepEqual(gen.next({drafts}).value, getCroppedImg(draft.journeyImageB64, 'file'), 'should generate file');
    assert.deepEqual(
      gen.next(onBoardingOne).value,
      put(
        setJourneyFromDrafts({
          journey: {
            ...JSON.parse(draft.journey),
            draftId: draft.id,
            photo: onBoardingOne,
          },
        }),
      ),
      'should set drafted journey as current journey',
    );
  });
  it('watchSetAsCurrentJourney, undefined draft', () => {
    const date = new Date(jest.now());
    const draft = {
      id: 'id id',
      draftType: DraftType.Draft,
      name: 'Name',
      journey: JSON.stringify({
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      }),
      journeyImageB64: 'base 64 generated',
    };
    const drafts = [draft];
    const gen = watchSetDraftAsCurrentJourney({
      type: actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
      id: date.toString(),
    });
    assert.deepEqual(gen.next().value, select(getDraftedJourneys), 'should select draftedJourneys');
    assert.deepEqual(
      gen.next({drafts}).value,
      showSagaAlert({
        message: 'toast.draftNotFound',
        mode: AlertMode.Error,
        alertOptions: {
          translate: true,
        },
      }),
      'should yield sagaAlert',
    );
    assert.deepEqual(gen.next().value, undefined);
  });
  it('watchSetAsCurrentJourney, error', () => {
    const date = new Date(jest.now());
    const gen = watchSetDraftAsCurrentJourney({
      type: actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
      id: date.toString(),
    });
    gen.next();
    const error = new Error('error is here!');
    assert.deepEqual(
      gen.throw(error).value,
      showSagaAlert({
        message: error.message,
        mode: AlertMode.Error,
      }),
    );
  });
});
