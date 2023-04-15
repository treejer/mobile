import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

export type DraftJourneyArgs = {
  journey: TCurrentJourney;
  draftType: DraftType;
  id: string;
  name?: string;
};
export const DRAFT_JOURNEY = 'DRAFT_JOURNEY';
export const draftJourney = ({journey, name, draftType, id}: DraftJourneyArgs) => ({
  type: DRAFT_JOURNEY,
  journey,
  name,
  draftType,
  id,
});

export type SaveDraftedJourneyArgs = {
  journey: TCurrentJourney;
  name?: string;
  draftType?: DraftType;
};
export const SAVE_DRAFTED_JOURNEY = 'SAVE_DRAFTED_JOURNEY';
export const saveDraftedJourney = ({journey, name, draftType}: SaveDraftedJourneyArgs) => ({
  type: SAVE_DRAFTED_JOURNEY,
  journey,
  name,
  draftType,
});

export type RemoveDraftedJourneyArgs = {
  id: string;
};
export const REMOVE_DRAFTED_JOURNEY = 'REMOVE_DRAFTED_JOURNEY';
export const removeDraftedJourney = ({id}: RemoveDraftedJourneyArgs) => ({
  type: REMOVE_DRAFTED_JOURNEY,
  id,
});

// * saga watcher actions
export type SetAsCurrentJourneyWatcherPayload = {
  id: string;
};
export const SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER = 'SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER';
export const setDraftAsCurrentJourneyWatcher = ({id}: SetAsCurrentJourneyWatcherPayload) => ({
  type: SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
  id,
});
