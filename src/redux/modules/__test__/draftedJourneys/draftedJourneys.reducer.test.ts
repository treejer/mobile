import {draftedJourneysReducer, DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {onBoardingOne} from '../../../../../assets/images';

describe('draftedJourneys reducer', () => {
  const initialState = {
    drafts: [],
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
    };
    expect(draftedJourneysReducer(state, actionsList.clearDraftedJourneys())).toEqual(initialState);
  });
});
