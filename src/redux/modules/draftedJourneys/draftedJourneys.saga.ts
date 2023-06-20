import {put, select, takeEvery} from 'redux-saga/effects';
import {TReduxState} from 'ranger-redux/store';
import {CommonActions} from '@react-navigation/native';

import {Routes} from 'navigation/Navigation';
import {navigationRef} from 'navigation/navigationRef';
import {isWeb} from 'utilities/helpers/web';
import {TreeLife} from 'utilities/helpers/treeInventory';
import getCroppedImg from 'utilities/helpers/cropImage';
import {photoToBase64} from 'utilities/helpers/photoToBase64';
import {AlertMode, showAlert, showSagaAlert} from 'utilities/helpers/alert';
import {TDraftedJourneysState} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import * as actionsList from './draftedJourneys.action';

export const getDraftedJourneys = (state: TReduxState) => state.draftedJourneys;

export type DraftJourneyAction = {
  type: string;
} & actionsList.DraftJourneyWatcherPayload;

export function* watchDraftJourney(action: DraftJourneyAction) {
  let journeyImageB64;
  if (isWeb()) {
    journeyImageB64 = yield photoToBase64(action.journey?.photo as File);
  }
  const newDraft: actionsList.DraftJourneyArgs = {
    id: action.id,
    journey: action.journey,
    name: action.name || action.id,
    draftType: action.draftType,
    journeyImageB64: journeyImageB64,
  };

  yield put(actionsList.draftJourney(newDraft));
}

export type SaveDraftedJourneyAction = {
  type: string;
} & actionsList.SaveDraftedJourneyWatcherPayload;
export function* watchSaveDraftedJourney(action: SaveDraftedJourneyAction) {
  const updatedDraft: actionsList.SaveDraftedJourneyArgs = {
    journey: action.journey,
    name: action.name,
    draftType: action.draftType,
    journeyImageB64: isWeb() ? (yield photoToBase64(action.journey?.photo as File)).toString() : undefined,
  };

  yield put(actionsList.saveDraftedJourney(updatedDraft));
}

export type SetDraftAsCurrentJourneyAction = {
  type: string;
} & actionsList.SetAsCurrentJourneyWatcherPayload;

export function* watchSetDraftAsCurrentJourney({id}: SetDraftAsCurrentJourneyAction) {
  const {drafts}: TDraftedJourneysState = yield select(getDraftedJourneys);
  const selectedDraft = drafts.find(draft => {
    const selectedJourney = JSON.parse(draft.journey);
    return [draft.id, selectedJourney.treeIdToPlant, selectedJourney.treeIdToUpdate].includes(id);
  });

  if (!selectedDraft) {
    yield showSagaAlert({
      message: 'toast.draftNotFound',
      mode: AlertMode.Error,
      alertOptions: {
        translate: true,
      },
    });
    return;
  }

  const currentJourney: TCurrentJourney = JSON.parse(selectedDraft.journey);

  let journeyPhoto;
  if (isWeb()) {
    journeyPhoto = yield getCroppedImg(selectedDraft.journeyImageB64, 'file');
  }

  if (selectedDraft) {
    yield put(
      setJourneyFromDrafts({
        journey: {
          ...currentJourney,
          draftId: selectedDraft.id,
          photo: isWeb() ? journeyPhoto : currentJourney.photo,
        },
      }),
    );
    // @ts-ignore
    navigationRef()?.dispatch(
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
  }
}

export function* draftedJourneysSagas() {
  yield takeEvery(actionsList.DRAFT_JOURNEY_WATCHER, watchDraftJourney);
  yield takeEvery(actionsList.SAVE_DRAFTED_JOURNEY_WATCHER, watchSaveDraftedJourney);
  yield takeEvery(actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER, watchSetDraftAsCurrentJourney);
}

export type navigateToGreenBlockArgs = {
  isNew: boolean;
  name?: string;
};

export function navigateToGreenBlock({isNew, name}: navigateToGreenBlockArgs) {
  showAlert({
    message: `submitTreeV2.toast.${isNew ? 'drafted' : 'draftSaved'}`,
    mode: AlertMode.Success,
    alertOptions: {
      translate: true,
      tParams: {
        message: {
          name,
        },
      },
    },
  });
  navigationRef()?.dispatch(
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
}
