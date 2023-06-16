import {put, select, takeEvery} from 'redux-saga/effects';
import {TReduxState} from 'ranger-redux/store';
import {CommonActions} from '@react-navigation/native';

import {Routes} from 'navigation/Navigation';
import {navigationRef} from 'navigation/navigationRef';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {TreeLife} from 'utilities/helpers/treeInventory';
import {TDraftedJourneysState} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import * as actionsList from './draftedJourneys.action';

export const getDraftedJourneys = (state: TReduxState) => state.draftedJourneys;

export type SetDraftAsCurrentJourneyAction = {
  type: string;
} & actionsList.SetAsCurrentJourneyWatcherPayload;

export function* watchSetDraftAsCurrentJourney({id}: SetDraftAsCurrentJourneyAction) {
  const {drafts}: TDraftedJourneysState = yield select(getDraftedJourneys);
  const selectedDraft = drafts.find(draft =>
    [draft.id, draft.journey.treeIdToPlant, draft.journey.treeIdToUpdate].includes(id),
  );
  console.log(selectedDraft, 'selectedDraft');

  if (selectedDraft) {
    yield put(setJourneyFromDrafts({journey: {...selectedDraft.journey, draftId: selectedDraft.id}}));
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
