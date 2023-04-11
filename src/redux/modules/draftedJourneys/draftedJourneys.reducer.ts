import {useCallback} from 'react';

import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import * as actionsList from './draftedJourneys.action';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export enum DraftType {
  Draft = 'draft',
  Offline = 'Offline',
}

export type DraftedJourney = {
  journey: TCurrentJourney;
  draftType: DraftType;
  id: string;
  name?: string;
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
};

export const draftedJourneysReducer = (
  state: TDraftedJourneysState = draftedJourneysInitialState,
  action: TDraftedJourneysAction,
) => {
  switch (action.type) {
    case actionsList.DRAFT_JOURNEY:
      const newDraft = {
        id: action.id,
        journey: action.journey,
        name: action.name || action.id,
        draftType: DraftType.Draft,
      };
      return {
        drafts: [...state.drafts, newDraft],
      };
    case actionsList.REMOVE_DRAFTED_JOURNEY:
      const filteredDraftedJourneys = state.drafts.filter(draft => draft.id !== action.id);
      return {
        drafts: filteredDraftedJourneys,
      };
    case actionsList.SAVE_DRAFTED_JOURNEY:
      const updatedDrafts = state.drafts.map(draft =>
        draft.id === action.journey?.draftId
          ? {
              ...draft,
              journey: action.journey || draft.journey,
              name: action.name || draft.name,
              draftType: action.draftType || draft.draftType,
            }
          : draft,
      );
      return {
        drafts: updatedDrafts,
      };

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
  //

  return {
    drafts,
    dispatchDraftJourney,
    dispatchRemoveDraftedJourney,
    dispatchSaveDraftedJourney,
    dispatchSetDraftAsCurrentJourney,
  };
};
