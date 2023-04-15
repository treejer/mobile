import * as actionsList from 'ranger-redux/modules/draftedJourneys/draftedJourneys.action';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

describe('draftedJourneys actions', () => {
  const journey = {
    location: {
      latitude: 2000,
      longitude: 222,
    },
    isSingle: true,
    isNursery: false,
    isUpdate: false,
  };
  it('draft journey with name', () => {
    const date = new Date(jest.now());
    const expectedAction = {
      name: 'SAMPLE',
      type: actionsList.DRAFT_JOURNEY,
      journey,
      draftType: DraftType.Draft,
      id: date.toString(),
    };
    expect(
      actionsList.draftJourney({draftType: DraftType.Draft, journey, name: 'SAMPLE', id: date.toString()}),
    ).toEqual(expectedAction);
  });
  it('draft journey without name', () => {
    const date = new Date(jest.now());
    const expectedAction = {
      type: actionsList.DRAFT_JOURNEY,
      journey,
      draftType: DraftType.Draft,
      id: date.toString(),
    };
    expect(actionsList.draftJourney({draftType: DraftType.Draft, journey, id: date.toString()})).toEqual(
      expectedAction,
    );
  });
  it('remove journey', () => {
    const date = new Date(jest.now());
    const expectedAction = {
      type: actionsList.REMOVE_DRAFTED_JOURNEY,
      id: date.toString(),
    };
    expect(actionsList.removeDraftedJourney({id: date.toString()})).toEqual(expectedAction);
  });
  it('save drafted journey, with change name and draftType', () => {
    const expectedAction = {
      type: actionsList.SAVE_DRAFTED_JOURNEY,
      journey,
      name: 'SAMPLE',
      draftType: DraftType.Offline,
    };
    expect(actionsList.saveDraftedJourney({journey, name: 'SAMPLE', draftType: DraftType.Offline})).toEqual(
      expectedAction,
    );
  });
  it('save drafted journey, without change name and draftType', () => {
    const expectedAction = {
      type: actionsList.SAVE_DRAFTED_JOURNEY,
      journey,
    };
    expect(actionsList.saveDraftedJourney({journey})).toEqual(expectedAction);
  });
  it('set as journey', () => {
    const date = new Date(jest.now());
    const expectedAction = {
      type: actionsList.SET_DRAFT_AS_CURRENT_JOURNEY_WATCHER,
      id: date.toString(),
    };
    expect(actionsList.setDraftAsCurrentJourneyWatcher({id: date.toString()})).toEqual(expectedAction);
  });
});
