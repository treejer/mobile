import * as assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {onBoardingOne} from '../../../../../assets/images';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {
  draftedJourneysSagas,
  getDraftedJourneys,
  watchDraftJourney,
  watchSaveDraftedJourney,
  watchSetDraftAsCurrentJourney,
} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';

describe('draftedJourneys saga', () => {
  it('functions should be defined', () => {
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
      journeyImageB64: undefined,
    };
    const gen = watchDraftJourney({type: actionsList.DRAFT_JOURNEY_WATCHER, ...draft});
    assert.deepEqual(gen.next().value, put(actionsList.draftJourney(draft)), 'should yield put draftJourney action');
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
      journeyImageB64: undefined,
    };
    const gen = watchSaveDraftedJourney({
      type: actionsList.SAVE_DRAFTED_JOURNEY_WATCHER,
      ...draft,
    });
    assert.deepEqual(gen.next().value, put(actionsList.saveDraftedJourney(draft)));
  });

  it('watchSetDraftAsCurrentJourney', () => {
    const date = new Date(jest.now());
    const gen = watchSetDraftAsCurrentJourney({
      id: date.toString(),
      type: actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
    });
    let next = gen.next();
    assert.deepEqual(next.value, select(getDraftedJourneys), 'select drafted journeys');

    const draftOne = {
      id: date.toString(),
      journey: JSON.stringify({
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      }),
      draftType: DraftType.Draft,
      createdAt: date,
      updatedAt: date,
    };
    const dateTwo = new Date();
    const draftTwo = {
      id: dateTwo.toString(),
      journey: JSON.stringify({
        location: {
          latitude: 2000,
          longitude: 2000,
        },
      }),
      draftType: DraftType.Offline,
      name: 'Name',
      createdAt: dateTwo,
      updatedAt: dateTwo,
    };

    next = gen.next({drafts: [draftOne, draftTwo]});
    assert.deepEqual(
      next.value,
      put(setJourneyFromDrafts({journey: {...JSON.parse(draftOne.journey), draftId: draftOne.id.toString()}})),
    );
  });
});
