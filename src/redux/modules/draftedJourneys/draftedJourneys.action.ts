import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

export type DraftJourneyArgs = {
  journey: TCurrentJourney;
  draftType: DraftType;
  id: string;
  name?: string;
  journeyImageB64?: string;
};
export const DRAFT_JOURNEY = 'DRAFT_JOURNEY';
export const draftJourney = ({journey, name, draftType, id, journeyImageB64}: DraftJourneyArgs) => ({
  type: DRAFT_JOURNEY,
  journey,
  name,
  draftType,
  id,
  journeyImageB64,
});

export type SaveDraftedJourneyArgs = {
  journey: TCurrentJourney;
  name?: string;
  draftType?: DraftType;
  journeyImageB64?: string;
};
export const SAVE_DRAFTED_JOURNEY = 'SAVE_DRAFTED_JOURNEY';
export const saveDraftedJourney = ({journey, name, draftType, journeyImageB64}: SaveDraftedJourneyArgs) => ({
  type: SAVE_DRAFTED_JOURNEY,
  journey,
  name,
  draftType,
  journeyImageB64,
});

export type RemoveDraftedJourneyArgs = {
  id: string;
};
export const REMOVE_DRAFTED_JOURNEY = 'REMOVE_DRAFTED_JOURNEY';
export const removeDraftedJourney = ({id}: RemoveDraftedJourneyArgs) => ({
  type: REMOVE_DRAFTED_JOURNEY,
  id,
});

export const CLEAR_DRAFTED_JOURNEYS = 'CLEAR_DRAFTED_JOURNEYS';
export const clearDraftedJourneys = () => ({
  type: CLEAR_DRAFTED_JOURNEYS,
});

// * saga watcher actions

export type DraftJourneyWatcherPayload = Omit<DraftJourneyArgs, 'journeyImageB64'>;
export const DRAFT_JOURNEY_WATCHER = 'DRAFT_JOURNEY_WATCHER';
export const draftJourneyWatcher = ({journey, draftType, id, name}: DraftJourneyWatcherPayload) => ({
  type: DRAFT_JOURNEY_WATCHER,
  journey,
  draftType,
  id,
  name,
});

export type SaveDraftedJourneyWatcherPayload = Omit<SaveDraftedJourneyArgs, 'journeyImageB64'>;
export const SAVE_DRAFTED_JOURNEY_WATCHER = 'SAVE_DRAFTED_JOURNEY_WATCHER';
export const saveDraftedJourneyWatcher = ({journey, draftType, name}: SaveDraftedJourneyWatcherPayload) => ({
  type: SAVE_DRAFTED_JOURNEY_WATCHER,
  journey,
  draftType,
  name,
});

export type SetAsCurrentJourneyWatcherPayload = {
  id: string;
};
export const SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER = 'SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER';
export const setDraftAsCurrentJourneyWatcher = ({id}: SetAsCurrentJourneyWatcherPayload) => ({
  type: SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
  id,
});
