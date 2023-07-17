import {AllTheProviders} from 'ranger-testUtils/testingLibrary';
import {act, renderHook} from '@testing-library/react-hooks';

import {onBoardingOne} from '../../../../../assets/images';
import {
  draftedJourneysReducer,
  DraftType,
  useDraftedJourneys,
} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import * as journey from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import * as storeHook from 'utilities/hooks/useStore';

describe('draftedJourneys reducer', () => {
  const initialState = {
    drafts: [],
    conflict: undefined,
  };
  const journey = {
    isSingle: true,
    isUpdate: false,
    location: {
      latitude: 2000,
      longitude: 2000,
    },
  };

  it('should return the initial state', () => {
    expect(draftedJourneysReducer(initialState, {type: ''})).toEqual(initialState);
  });
  it('should handle DRAFT_JOURNEY, without name', () => {
    const date = new Date(jest.now());
    const newDraft = {
      journey,
      draftType: DraftType.Draft,
      id: date.toString(),
      journeyImageB64: undefined,
    };
    const expectedValue = {
      drafts: [
        ...initialState.drafts,
        {
          ...newDraft,
          name: date.toString(),
          journey: JSON.stringify(newDraft.journey),
          createdAt: new Date(newDraft.id),
          updatedAt: new Date(newDraft.id),
        },
      ],
      conflict: undefined,
    };
    expect(draftedJourneysReducer(initialState, actionsList.draftJourney(newDraft))).toEqual(expectedValue);
  });
  it('should handle DRAFT_JOURNEY, native', () => {
    const date = new Date(jest.now());
    const newDraft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${date}`,
      id: date.toString(),
      journeyImageB64: undefined,
    };
    const expectedValue = {
      drafts: [
        ...initialState.drafts,
        {
          ...newDraft,
          journey: JSON.stringify(newDraft.journey),
          createdAt: new Date(newDraft.id),
          updatedAt: new Date(newDraft.id),
        },
      ],
      conflict: undefined,
    };
    expect(draftedJourneysReducer(initialState, actionsList.draftJourney(newDraft))).toEqual(expectedValue);
  });
  it('should handle DRAFT_JOURNEY, web', () => {
    const date = new Date(jest.now());
    const newDraft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${date}`,
      id: date.toString(),
      journeyImageB64: 'image base 64',
    };
    const expectedValue = {
      drafts: [
        ...initialState.drafts,
        {
          ...newDraft,
          journey: JSON.stringify(newDraft.journey),
          createdAt: new Date(newDraft.id),
          updatedAt: new Date(newDraft.id),
        },
      ],
      conflict: undefined,
    };
    expect(draftedJourneysReducer(initialState, actionsList.draftJourney(newDraft))).toEqual(expectedValue);
  });
  it('should handle REMOVE_DRAFTED_JOURNEY', () => {
    const date = new Date(jest.now());
    const draft = {
      journey: JSON.stringify(journey),
      draftType: DraftType.Draft,
      name: `Draft ${date}`,
      id: date.toString(),
      createdAt: date,
      updatedAt: date,
    };
    const state = {
      drafts: [...initialState.drafts, draft],
      conflict: undefined,
    };

    expect(draftedJourneysReducer(state, actionsList.removeDraftedJourney({id: draft.id}))).toEqual(initialState);
  });
  it('should handle SAVE_DRAFTED_JOURNEY, native', () => {
    const draftDate = new Date(jest.now());
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${draftDate}`,
      id: draftDate.toString(),
      createdAt: new Date(draftDate.toString()),
      updatedAt: new Date(draftDate.toString()),
    };
    const state = {
      drafts: [...initialState.drafts, {...draft, journey: JSON.stringify(draft.journey)}],
      conflict: undefined,
    };
    const updatedDraft = {
      journey: {
        ...journey,
        draftId: draft.id,
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
      draftType: DraftType.Draft,
      name: draft.name,
      id: draft.id,
      createdAt: new Date(draft.id.toString()),
      updatedAt: new Date(jest.now()),
    };
    const updatedState = {
      drafts: [...initialState.drafts, {...updatedDraft, journey: JSON.stringify(updatedDraft.journey)}],
      conflict: undefined,
    };
    expect(
      draftedJourneysReducer(
        state,
        actionsList.saveDraftedJourney({
          journey: updatedDraft.journey,
          draftType: updatedDraft.draftType,
          name: updatedDraft.name,
        }),
      ),
    ).toEqual(updatedState);
  });
  it('should handle SAVE_DRAFTED_JOURNEY, web', () => {
    const draftDate = new Date(jest.now());
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${draftDate}`,
      id: draftDate.toString(),
      createdAt: new Date(draftDate.toString()),
      updatedAt: new Date(draftDate.toString()),
      journeyImageB64: 'image base 64',
    };
    const state = {
      drafts: [...initialState.drafts, {...draft, journey: JSON.stringify(draft.journey)}],
      conflict: undefined,
    };
    const updatedDraft = {
      journey: {
        ...journey,
        draftId: draft.id,
        photo: onBoardingOne,
        photoLocation: {
          latitude: 2000,
          longitude: 2000,
        },
      },
      draftType: DraftType.Draft,
      name: draft.name,
      id: draft.id,
      createdAt: new Date(draft.id.toString()),
      updatedAt: new Date(jest.now()),
      journeyImageB64: 'image base 64 updated',
    };
    const updatedState = {
      drafts: [...initialState.drafts, {...updatedDraft, journey: JSON.stringify(updatedDraft.journey)}],
      conflict: undefined,
    };
    expect(
      draftedJourneysReducer(
        state,
        actionsList.saveDraftedJourney({
          journey: updatedDraft.journey,
          draftType: updatedDraft.draftType,
          name: updatedDraft.name,
          journeyImageB64: 'image base 64 updated',
        }),
      ),
    ).toEqual(updatedState);
  });
  it('should handle SET_AS_CURRENT_JOURNEY', () => {
    const date = new Date(jest.now());
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${jest.now()}`,
      id: date.toString(),
      createdAt: date,
      updatedAt: date,
    };
    const state = {
      drafts: [...initialState.drafts, {...draft, journey: JSON.stringify(draft.journey)}],
      conflict: undefined,
    };
    expect(draftedJourneysReducer(state, actionsList.setDraftAsCurrentJourneyWatcher({id: draft.id}))).toEqual(state);
  });
  it('should handle CLEAR_DRAFTED_JOURNEYS', () => {
    const date = new Date(jest.now());
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${jest.now()}`,
      id: date.toString(),
      createdAt: date,
      updatedAt: date,
    };
    const state = {
      drafts: [...initialState.drafts, {...draft, journey: JSON.stringify(draft.journey)}],
      conflict: undefined,
    };
    expect(draftedJourneysReducer(state, actionsList.clearDraftedJourneys())).toEqual(initialState);
  });
  it('should handle CONFLICT_WHILE_REMOVING', () => {
    const state = {
      drafts: [],
      conflict: undefined,
    };
    const expectedState = {
      drafts: [],
      conflict: 'ID',
    };
    expect(draftedJourneysReducer(state, actionsList.conflictWhileRemoving({conflict: 'ID'}))).toEqual(expectedState);
  });
  it('should handle RESOLVE_CONFLICT', () => {
    const state = {
      drafts: [],
      conflict: undefined,
    };
    const expectedState = {
      drafts: [],
      conflict: undefined,
    };
    expect(draftedJourneysReducer(state, actionsList.resolveConflict())).toEqual(expectedState);
  });
});

describe('draftedJourney hook', () => {
  const mockCurrentJourney = jest.fn(() => {});
  const mockDispatch = jest.fn((action: () => void) => {});
  const _journeySpy = jest.spyOn(journey, 'useCurrentJourney').mockImplementation(
    () =>
      ({
        dispatchClearJourney: mockCurrentJourney,
      } as any),
  );
  const _dispatchSpy = jest.spyOn(storeHook, 'useAppDispatch').mockImplementation(() => mockDispatch as any);
  const wrapper = {
    wrapper: props => (
      <AllTheProviders
        {...(props as any)}
        initialState={{
          draftedJourneys: {
            drafts: [
              {
                name: 'S',
                journey: JSON.stringify({
                  treeIdToUpdate: 'S',
                }),
                draftType: DraftType.Draft,
                id: 'ID',
                createdAt: 'DATE',
                updatedAt: 'DATE',
              },
            ],
          },
        }}
      />
    ),
  };
  const {result} = renderHook(() => useDraftedJourneys(), wrapper);

  it('should return state value', () => {
    expect(result.current.drafts).toEqual([
      {
        name: 'S',
        journey: JSON.stringify({
          treeIdToUpdate: 'S',
        }),
        draftType: DraftType.Draft,
        id: 'ID',
        createdAt: 'DATE',
        updatedAt: 'DATE',
      },
    ]);
  });

  it('should handle dispatchClearDraftedJourneys', () => {
    act(() => {
      result.current.dispatchClearDraftedJourneys();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.clearDraftedJourneys());
  });

  it('should handle dispatchDraftJourney', () => {
    act(() => {
      result.current.dispatchDraftJourney({draftType: DraftType.Offline, id: 'X', name: 'NAME', journey: {}});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      actionsList.draftJourneyWatcher({draftType: DraftType.Offline, id: 'X', name: 'NAME', journey: {}}),
    );
  });
  it('should handle dispatchSetDraftAsCurrentJourney', () => {
    act(() => {
      result.current.dispatchSetDraftAsCurrentJourney({id: 'ID'});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.setDraftAsCurrentJourneyWatcher({id: 'ID'}));
  });
  it('should handle dispatchRemoveDraftedJourney', () => {
    act(() => {
      result.current.dispatchRemoveDraftedJourney({id: 'ID'});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.removeDraftedJourneyWatcher({id: 'ID'}));
  });
  it('should handle dispatchForceRemoveDraftedJourney', () => {
    act(() => {
      result.current.dispatchForceRemoveDraftedJourney({id: 'ID'});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.removeDraftedJourney({id: 'ID'}));
    expect(mockCurrentJourney).toHaveBeenCalled();
  });
  it('should handle dispatchRemoveDraftedJourney', () => {
    act(() => {
      result.current.dispatchSaveDraftedJourney({draftType: DraftType.Draft, name: 'name2', journey: {}});
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(
      actionsList.saveDraftedJourneyWatcher({draftType: DraftType.Draft, name: 'name2', journey: {}}),
    );
  });
  it('should handle dispatchResolveConflict', () => {
    act(() => {
      result.current.dispatchResolveConflict();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(actionsList.resolveConflict());
  });
  it('should handle checkExistAnyDraftOfTree', () => {
    expect(result.current.checkExistAnyDraftOfTree('X')).toBeFalsy();
    expect(result.current.checkExistAnyDraftOfTree('S')).toBeTruthy();
  });
});
