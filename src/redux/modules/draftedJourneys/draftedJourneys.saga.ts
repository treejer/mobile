import {put, select, takeEvery} from 'redux-saga/effects';
import {TReduxState} from 'ranger-redux/store';
import {CommonActions} from '@react-navigation/native';

import {Routes} from 'navigation/Navigation';
import {navigationRef} from 'navigation/navigationRef';
import {TDraftedJourneysState} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {setJourneyFromDrafts} from 'ranger-redux/modules/currentJourney/currentJourney.action';
import * as actionsList from './draftedJourneys.action';

export const getDraftedJourneys = (state: TReduxState) => state.draftedJourneys;

export type SetDraftAsCurrentJourneyAction = {
  type: string;
} & actionsList.SetAsCurrentJourneyWatcherPayload;

export function* watchSetDraftAsCurrentJourney({id}: SetDraftAsCurrentJourneyAction) {
  const {drafts}: TDraftedJourneysState = yield select(getDraftedJourneys);
  const selectedDraft = drafts.find(draft => draft.id === id);

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
