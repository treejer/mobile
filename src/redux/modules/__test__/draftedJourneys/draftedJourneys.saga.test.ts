import * as assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import {onBoardingOne} from '../../../../../assets/images';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {
  draftedJourneysSagas,
  getDraftedJourneys,
  watchSetDraftAsCurrentJourney,
} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';

describe('draftedJourneys saga', () => {
  it('functions should be defined', () => {
    expect(draftedJourneysSagas).toBeDefined();
    expect(watchSetDraftAsCurrentJourney).toBeDefined();
  });

  it('draftedJourneysSaga', () => {
    const gen = draftedJourneysSagas();
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER, watchSetDraftAsCurrentJourney),
    );
  });

  it('setDraftAsCurrentJourney', () => {
    const date = new Date(jest.now());
    const gen = watchSetDraftAsCurrentJourney({
      id: date.toString(),
      type: actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
    });
    let next = gen.next();
    assert.deepEqual(next.value, select(getDraftedJourneys), 'select drafted journeys');

    const draftOne = {
      id: date.toString(),
      journey: {
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
      draftType: DraftType.Draft,
    };
    const draftTwo = {
      id: new Date().toString(),
      journey: {
        location: {
          latitude: 2000,
          longitude: 2000,
        },
      },
      draftType: DraftType.Offline,
      name: 'Name',
    };

    next = gen.next({drafts: [draftOne, draftTwo]});
    assert.deepEqual(
      next.value,
      put(setJourneyFromDrafts({journey: {...draftOne.journey, draftId: draftOne.id.toString()}})),
    );
  });
});
