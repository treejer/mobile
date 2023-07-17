import {useCallback} from 'react';

import {sortByDate} from 'utilities/helpers/sortByDate';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {TCurrentJourney, useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {getDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';

export enum DraftType {
  Draft = 'Draft',
  Offline = 'Offline',
}

export type DraftedJourney = {
  journey: string;
  draftType: DraftType;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  journeyImageB64?: string;
};

export type TDraftedJourneysState = {
  drafts: DraftedJourney[];
  conflict?: string;
};

export const draftedJourneysInitialState: TDraftedJourneysState = {
  drafts: [],
  conflict: undefined,
};

export type TDraftedJourneysAction = {
  type: string;
  name?: string;
  draftType?: DraftType;
  journey?: TCurrentJourney;
  id?: string;
  drafts?: DraftedJourney[];
  journeyImageB64?: string;
  conflict?: string;
};

export const draftedJourneysReducer = (
  state: TDraftedJourneysState = draftedJourneysInitialState,
  action: TDraftedJourneysAction,
) => {
  switch (action.type) {
    case actionsList.DRAFT_JOURNEY:
      const newDraft: DraftedJourney = {
        id: action.id!,
        createdAt: new Date(action?.id!),
        updatedAt: new Date(action?.id!),
        journey: JSON.stringify(action.journey),
        name: action?.name || action?.id,
        draftType: action?.draftType!,
        journeyImageB64: action.journeyImageB64 || undefined,
      };

      return {
        ...state,
        drafts: [newDraft, ...state.drafts],
      };
    case actionsList.REMOVE_DRAFTED_JOURNEY:
      const filteredDraftedJourneys = state.drafts.filter(draft => draft.id !== action.id);
      return {
        drafts: filteredDraftedJourneys,
        conflict: undefined,
      };
    case actionsList.SAVE_DRAFTED_JOURNEY:
      const cloneDrafts = [...state.drafts];
      const selectedDraftIndex = cloneDrafts.findIndex(draft => draft.id === action?.journey?.draftId);
      const selectedDraft = {...cloneDrafts[selectedDraftIndex]};
      selectedDraft.journey = JSON.stringify(action.journey);
      selectedDraft.draftType = action?.draftType!;
      selectedDraft.updatedAt = new Date();
      selectedDraft.journeyImageB64 = action.journeyImageB64 || selectedDraft.journeyImageB64;
      cloneDrafts[selectedDraftIndex] = selectedDraft;

      return {
        ...state,
        drafts: sortByDate<DraftedJourney>(cloneDrafts, 'updatedAt'),
      };
    case actionsList.CONFLICT_WHILE_REMOVING: {
      return {
        ...state,
        conflict: action?.conflict!,
      };
    }
    case actionsList.RESOLVE_CONFLICT: {
      return {
        ...state,
        conflict: undefined,
      };
    }
    case actionsList.CLEAR_DRAFTED_JOURNEYS:
      return draftedJourneysInitialState;
    default:
      return state;
  }
};

export const useDraftedJourneys = () => {
  const {drafts, conflict} = useAppSelector(getDraftedJourneys);
  const {dispatchClearJourney} = useCurrentJourney();
  const dispatch = useAppDispatch();

  const dispatchDraftJourney = useCallback(
    (args: actionsList.DraftJourneyWatcherPayload) => {
      dispatch(actionsList.draftJourneyWatcher(args));
    },
    [dispatch],
  );

  const dispatchRemoveDraftedJourney = useCallback(
    (args: actionsList.RemoveDraftedJourneyWatcherPayload) => {
      dispatch(actionsList.removeDraftedJourneyWatcher(args));
    },
    [dispatch],
  );

  const dispatchForceRemoveDraftedJourney = useCallback(
    (args: actionsList.RemoveDraftedJourneyArgs) => {
      dispatch(actionsList.removeDraftedJourney(args));
      dispatchClearJourney();
    },
    [dispatch, dispatchClearJourney],
  );

  const dispatchSaveDraftedJourney = useCallback(
    (args: actionsList.SaveDraftedJourneyWatcherPayload) => {
      dispatch(actionsList.saveDraftedJourneyWatcher(args));
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

  const dispatchResolveConflict = useCallback(() => {
    dispatch(actionsList.resolveConflict());
  }, [dispatch]);

  const checkExistAnyDraftOfTree = useCallback(
    (treeId: string) => {
      return drafts.some(draft =>
        [JSON.parse(draft.journey).treeIdToPlant, JSON.parse(draft.journey).treeIdToUpdate].includes(treeId),
      );
    },
    [drafts],
  );

  return {
    drafts,
    conflict,
    dispatchDraftJourney,
    dispatchRemoveDraftedJourney,
    dispatchForceRemoveDraftedJourney,
    dispatchSaveDraftedJourney,
    dispatchSetDraftAsCurrentJourney,
    dispatchClearDraftedJourneys,
    checkExistAnyDraftOfTree,
    dispatchResolveConflict,
  };
};
