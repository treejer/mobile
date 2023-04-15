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
  it('should handle DRAFT_JOURNEY', () => {
    const date = new Date(jest.now());
    const newDraft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${date}`,
      id: date.toString(),
    };
    const expectedValue = {
      drafts: [...initialState.drafts, newDraft],
    };
    expect(draftedJourneysReducer(initialState, actionsList.draftJourney(newDraft))).toEqual(expectedValue);
  });
  it('should handle REMOVE_DRAFTED_JOURNEY', () => {
    const date = new Date(jest.now());
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${date}`,
      id: date.toString(),
    };
    const state = {
      drafts: [...initialState.drafts, draft],
    };

    expect(draftedJourneysReducer(state, actionsList.removeDraftedJourney({id: draft.id}))).toEqual(initialState);
  });
  it('should handle SAVE_DRAFTED_JOURNEY', () => {
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${jest.now()}`,
      id: `Draft ${jest.now()}`,
    };
    const state = {
      drafts: [...initialState.drafts, draft],
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
    };
    const updatedState = {
      drafts: [...initialState.drafts, updatedDraft],
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
  it('should handle SET_AS_CURRENT_JOURNEY', () => {
    const date = new Date(jest.now());
    const draft = {
      journey,
      draftType: DraftType.Draft,
      name: `Draft ${jest.now()}`,
      id: date.toString(),
    };
    const state = {
      drafts: [...initialState.drafts, draft],
    };
    expect(draftedJourneysReducer(state, actionsList.setDraftAsCurrentJourneyWatcher({id: draft.id}))).toEqual(state);
  });
});
