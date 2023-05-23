import {useCallback} from 'react';

import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import * as actionsList from './draftedJourneys.action';
import {navigateToGreenBlock} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';
import {sortByDate} from 'utilities/helpers/sortByDate';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export enum DraftType {
  Draft = 'Draft',
  Offline = 'Offline',
}

export type DraftedJourney = {
  journey: TCurrentJourney;
  draftType: DraftType;
  id: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TDraftedJourneysState = {
  drafts: DraftedJourney[];
};

export const draftedJourneysInitialState: TDraftedJourneysState = {
  drafts: [],
};

export type TDraftedJourneysAction = {
  type: string;
  name?: string;
  draftType?: DraftType;
  journey?: TCurrentJourney;
  id?: string;
  drafts?: DraftedJourney[];
};

export const draftedJourneysReducer = (
  state: TDraftedJourneysState = draftedJourneysInitialState,
  action: TDraftedJourneysAction,
) => {
  switch (action.type) {
    case actionsList.DRAFT_JOURNEY:
      const newDraft = {
        id: action.id,
        createdAt: new Date(action?.id || ''),
        updatedAt: new Date(action?.id || ''),
        journey: action.journey,
        name: action.name || action.id,
        draftType: action.draftType,
      };

      navigateToGreenBlock({isNew: true, name: newDraft?.name});
      return {
        drafts: [newDraft, ...state.drafts],
      };
    case actionsList.REMOVE_DRAFTED_JOURNEY:
      const filteredDraftedJourneys = state.drafts.filter(draft => draft.id !== action.id);
      return {
        drafts: filteredDraftedJourneys,
      };
    case actionsList.SAVE_DRAFTED_JOURNEY:
      const cloneDrafts = [...state.drafts];
      const selectedDraftIndex = cloneDrafts.findIndex(draft => draft.id === action.journey?.draftId);
      const selectedDraft = {...cloneDrafts[selectedDraftIndex]};
      selectedDraft.journey = action.journey || selectedDraft.journey;
      selectedDraft.name = action.name || selectedDraft.name;
      selectedDraft.draftType = action.draftType || selectedDraft.draftType;
      selectedDraft.updatedAt = new Date();
      cloneDrafts[selectedDraftIndex] = selectedDraft;

      navigateToGreenBlock({isNew: false, name: selectedDraft?.name});
      return {
        drafts: sortByDate(cloneDrafts, 'updatedAt'),
      };
    case actionsList.CLEAR_DRAFTED_JOURNEYS:
      return draftedJourneysInitialState;
    default:
      return state;
  }
};

export const useDraftedJourneys = () => {
  const {drafts} = useAppSelector(state => state.draftedJourneys);
  const dispatch = useAppDispatch();

  const dispatchDraftJourney = useCallback(
    (args: actionsList.DraftJourneyArgs) => {
      dispatch(actionsList.draftJourney(args));
    },
    [dispatch],
  );

  const dispatchRemoveDraftedJourney = useCallback(
    (args: actionsList.RemoveDraftedJourneyArgs) => {
      dispatch(actionsList.removeDraftedJourney(args));
    },
    [dispatch],
  );

  const dispatchSaveDraftedJourney = useCallback(
    (args: actionsList.SaveDraftedJourneyArgs) => {
      dispatch(actionsList.saveDraftedJourney(args));
    },
    [dispatch],
  );

  const dispatchSetDraftAsCurrentJourney = useCallback(
    (args: actionsList.SetAsCurrentJourneyWatcherPayload) => {
      dispatch(actionsList.setDraftAsCurrentJourneyWatcher(args));
    },
    [dispatch],
  );

  const dispatchClearDraftedJourneys = useCallback(() => {
    dispatch(actionsList.clearDraftedJourneys());
  }, [dispatch]);

  return {
    drafts,
    dispatchDraftJourney,
    dispatchRemoveDraftedJourney,
    dispatchSaveDraftedJourney,
    dispatchSetDraftAsCurrentJourney,
    dispatchClearDraftedJourneys,
  };
};
