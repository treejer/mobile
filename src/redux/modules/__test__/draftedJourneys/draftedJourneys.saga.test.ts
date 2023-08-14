import * as assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';
import {CommonActions} from '@react-navigation/native';

import {onBoardingOne} from '../../../../../assets/images';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {
  draftedJourneysSagas,
  getDraftedJourneys,
  navigateToGreenBlock,
  watchDraftJourney,
  watchRemoveDraftedJourney,
  watchSaveDraftedJourney,
  watchSetDraftAsCurrentJourney,
} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';
import * as alerts from 'utilities/helpers/alert';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {TreeLife} from 'utilities/helpers/treeInventory';
import {Routes} from 'navigation/Navigation';
import * as navigation from 'navigation/navigationRef';
import {getCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.saga';
import {conflictWhileRemoving, removeDraftedJourney} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';

describe('draftedJourneys saga', () => {
  it('functions should be defined', () => {
    expect(draftedJourneysSagas).toBeDefined();
    expect(watchSetDraftAsCurrentJourney).toBeDefined();
    expect(watchDraftJourney).toBeDefined();
    expect(watchSaveDraftedJourney).toBeDefined();
    expect(watchRemoveDraftedJourney).toBeDefined();
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
    assert.deepEqual(
      gen.next().value,
      takeEvery(actionsList.REMOVE_DRAFTED_JOURNEY_WATCHER, watchRemoveDraftedJourney),
      'should yield takeEvery setDraftAsCurrentJourney watcher',
    );
  });

  it('watchRemoveDraftedJourney without conflict', () => {
    const gen = watchRemoveDraftedJourney({id: 'X', type: actionsList.REMOVE_DRAFTED_JOURNEY_WATCHER});
    assert.deepEqual(gen.next().value, select(getCurrentJourney));
    assert.deepEqual(gen.next({draftId: undefined}).value, put(removeDraftedJourney({id: 'X'})));
  });

  it('watchRemoveDraftedJourney with conflict', () => {
    const gen = watchRemoveDraftedJourney({id: 'X', type: actionsList.REMOVE_DRAFTED_JOURNEY_WATCHER});
    assert.deepEqual(gen.next().value, select(getCurrentJourney));
    assert.deepEqual(gen.next({draftId: 'X'}).value, put(conflictWhileRemoving({conflict: 'X'})));
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
    assert.deepEqual(gen.next().value, navigateToGreenBlock({isNew: true, name: 'Name'}));
  });

  it('watchDraftJourney without name', () => {
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
    const gen = watchDraftJourney({type: actionsList.DRAFT_JOURNEY_WATCHER, ...draft, name: undefined});
    assert.deepEqual(
      gen.next().value,
      put(actionsList.draftJourney({...draft, name: date.toString()})),
      'should yield put draftJourney action',
    );
    assert.deepEqual(gen.next().value, navigateToGreenBlock({isNew: true, name: date.toString()}));
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
    assert.deepEqual(gen.next().value, navigateToGreenBlock({isNew: false, name: 'Name'}));
  });

  it('watchSetDraftAsCurrentJourney', () => {
    const mockDispatch = jest.fn((action: () => void) => {});
    const _spy = jest.spyOn(navigation, 'navigationRef').mockImplementation(
      () =>
        ({
          dispatch: mockDispatch,
        } as any),
    );
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
    gen.next();
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.TreeSubmission_V2,
            params: {
              initialRouteName: Routes.SubmitTree_V2,
            },
          },
        ],
      }),
    );
  });

  it('watchSetDraftAsCurrentJourney not found', () => {
    const date = new Date(jest.now());
    const gen = watchSetDraftAsCurrentJourney({
      id: 'X',
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

    assert.deepEqual(
      gen.next({drafts: [draftOne, draftTwo]}).value,
      showSagaAlert({
        message: 'toast.draftNotFound',
        mode: AlertMode.Error,
        alertOptions: {
          translate: true,
        },
      }),
    );
  });
});

describe('navigateToGreenBlock', () => {
  it('should be defined', () => {
    expect(navigateToGreenBlock).toBeDefined();
  });
  it('should navigate to green block, isNew', () => {
    const mockDispatch = jest.fn((action: () => void) => {});
    const _spy = jest.spyOn(navigation, 'navigationRef').mockImplementation(
      () =>
        ({
          dispatch: mockDispatch,
        } as any),
    );
    const showAlertSpy = jest.spyOn(alerts, 'showAlert');
    const gen = navigateToGreenBlock({isNew: true, name: 'Name'});
    gen.next();
    expect(showAlertSpy).toHaveBeenCalled();
    expect(showAlertSpy).toHaveBeenCalledWith({
      message: 'submitTreeV2.toast.drafted',
      mode: AlertMode.Success,
      alertOptions: {
        translate: true,
        tParams: {
          message: {
            name: 'Name',
          },
        },
      },
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.GreenBlock,
            params: {
              tabFilter: TreeLife.Drafted,
            },
          },
        ],
      }),
    );
  });
  it('should navigate to green block, isNew=false', () => {
    const mockDispatch = jest.fn((action: () => void) => {});
    const _spy = jest.spyOn(navigation, 'navigationRef').mockImplementation(
      () =>
        ({
          dispatch: mockDispatch,
        } as any),
    );
    const showAlertSpy = jest.spyOn(alerts, 'showAlert');
    const gen = navigateToGreenBlock({isNew: false, name: 'Name'});
    gen.next();
    expect(showAlertSpy).toHaveBeenCalled();
    expect(showAlertSpy).toHaveBeenCalledWith({
      message: 'submitTreeV2.toast.draftSaved',
      mode: AlertMode.Success,
      alertOptions: {
        translate: true,
        tParams: {
          message: {
            name: 'Name',
          },
        },
      },
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.GreenBlock,
            params: {
              tabFilter: TreeLife.Drafted,
            },
          },
        ],
      }),
    );
  });
});
