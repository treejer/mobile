import {currentJourneyReducer} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';
import {onBoardingOne} from '../../../../../assets/images';

describe('currentJourney reducer', () => {
  const initialState = {
    location: {
      latitude: 0,
      longitude: 0,
    },
  };

  it('should return the initial state', () => {
    expect(currentJourneyReducer(initialState, {type: ''})).toEqual(initialState);
  });
  it('should handle START_PLANT_SINGLE_TREE', () => {
    const expectedValue = {
      ...initialState,
      isNursery: false,
      isUpdate: false,
      isSingle: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.startPlantSingleTree())).toEqual(expectedValue);
  });
  it('should handle START_PLANT_ASSIGNED_TREE', () => {
    const expectedValue = {
      ...initialState,
      isSingle: true,
      isNursery: false,
      isUpdate: false,
      tree: treeDetail,
      treeIdToPlant: treeDetail.id,
    };
    expect(
      currentJourneyReducer(
        initialState,
        actionsList.startPlantAssignedTree({tree: treeDetail as any, treeIdToPlant: treeDetail.id}),
      ),
    ).toEqual(expectedValue);
  });
  it('should handle START_PLANT_NURSERY', () => {
    const nurseryCount = 3;
    const expectedValue = {
      location: {
        latitude: 0,
        longitude: 0,
      },
      isUpdate: false,
      isNursery: true,
      isSingle: false,
      nurseryCount,
    };
    expect(currentJourneyReducer(initialState, actionsList.startPlantNursery({count: nurseryCount}))).toEqual(
      expectedValue,
    );
  });
  it('should handle SET_TREE_PHOTO, discard update location = false', () => {
    const photo = onBoardingOne;
    const photoLocation = {
      latitude: 2003423,
      longitude: 213123123,
    };
    const expectedValue = {
      ...initialState,
      photo,
      photoLocation,
      nurseryContinuedUpdatingLocation: false,
    };
    expect(currentJourneyReducer(initialState, actionsList.setTreePhoto({photo, photoLocation}))).toEqual(
      expectedValue,
    );
  });
  it('should handle SET_TREE_PHOTO, discard update location = true', () => {
    const photo = onBoardingOne;
    const photoLocation = {
      latitude: 2003423,
      longitude: 213123123,
    };
    const expectedValue = {
      ...initialState,
      photo,
      photoLocation,
      nurseryContinuedUpdatingLocation: true,
    };
    expect(
      currentJourneyReducer(
        initialState,
        actionsList.setTreePhoto({photo, photoLocation, discardUpdateLocation: true}),
      ),
    ).toEqual(expectedValue);
  });
  it('should handle SET_TREE_LOCATION', () => {
    const coords = {
      latitude: 200000,
      longitude: 123130,
    };
    const expectedValue = {
      ...initialState,
      location: coords,
    };
    expect(currentJourneyReducer(initialState, actionsList.setTreeLocation({coords}))).toEqual(expectedValue);
  });
  it('should handle DISCARD_UPDATE_NURSERY_LOCATION', () => {
    const expectedValue = {
      ...initialState,
      nurseryContinuedUpdatingLocation: true,
    };
    expect(currentJourneyReducer(initialState, actionsList.discardUpdateNurseryLocation())).toEqual(expectedValue);
  });
  it('should handle SET_TREE_DETAIL_TO_UPDATE', () => {
    const coords = {
      latitude: 200000,
      longitude: 123130,
    };
    const expectedValue = {
      ...initialState,
      location: coords,
      tree: treeDetail,
      treeIdToUpdate: treeDetail.id,
    };
    expect(
      currentJourneyReducer(
        initialState,
        actionsList.setTreeDetailToUpdate({tree: treeDetail as any, treeIdToUpdate: treeDetail.id, location: coords}),
      ),
    ).toEqual(expectedValue);
  });
});
