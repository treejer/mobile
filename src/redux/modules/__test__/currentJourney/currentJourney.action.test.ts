import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {onBoardingOne} from '../../../../../assets/images';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';

describe('currentJourney actions', () => {
  it('start to plant single tree', () => {
    const expectedAction = {
      type: actionsList.START_PLANT_SINGLE_TREE,
    };
    expect(actionsList.startPlantSingleTree()).toEqual(expectedAction);
  });
  it('start to plant assigned tree', () => {
    const expectedAction = {
      type: actionsList.START_PLANT_ASSIGNED_TREE,
      treeIdToPlant: treeDetail.id,
      tree: treeDetail,
    };
    expect(actionsList.startPlantAssignedTree({tree: treeDetail as any, treeIdToPlant: treeDetail.id})).toEqual(
      expectedAction,
    );
  });
  it('start to plant nursery', () => {
    const count = 3;
    const expectedAction = {
      type: actionsList.START_PLANT_NURSERY,
      nurseryCount: count,
    };
    expect(actionsList.startPlantNursery({count})).toEqual(expectedAction);
  });
  it('set tree location', () => {
    const treeCoordsLocation = {
      latitude: 200000,
      longitude: 5000000,
    };
    const expectedAction = {
      type: actionsList.SET_TREE_LOCATION,
      location: treeCoordsLocation,
    };
    expect(actionsList.setTreeLocation({coords: treeCoordsLocation})).toEqual(expectedAction);
  });
  it('set tree photo', () => {
    const treePhoto = onBoardingOne;
    const treeCoordsLocation = {
      latitude: 200000,
      longitude: 5000000,
    };

    const expectedAction = {
      type: actionsList.SET_TREE_PHOTO,
      photo: treePhoto,
      photoLocation: treeCoordsLocation,
      discardUpdateLocation: false,
    };
    expect(actionsList.setTreePhoto({photo: treePhoto, photoLocation: treeCoordsLocation})).toEqual(expectedAction);
  });
  it('set tree photo & discard update location', () => {
    const treePhoto = onBoardingOne;
    const treeCoordsLocation = {
      latitude: 200000,
      longitude: 5000000,
    };
    const expectedAction = {
      type: actionsList.SET_TREE_PHOTO,
      photo: treePhoto,
      photoLocation: treeCoordsLocation,
      discardUpdateLocation: true,
    };
    expect(
      actionsList.setTreePhoto({photo: treePhoto, photoLocation: treeCoordsLocation, discardUpdateLocation: true}),
    ).toEqual(expectedAction);
  });
  it('discard update nursery location', () => {
    const expectedAction = {
      type: actionsList.DISCARD_UPDATE_NURSERY_LOCATION,
    };
    expect(actionsList.discardUpdateNurseryLocation()).toEqual(expectedAction);
  });
  it('set tree detail to update', () => {
    const treeCoordsLocation = {
      latitude: 200000,
      longitude: 5000000,
    };
    const expectedAction = {
      type: actionsList.SET_TREE_DETAIL_TO_UPDATE,
      location: treeCoordsLocation,
      treeIdToUpdate: treeDetail.id,
      tree: treeDetail,
    };

    expect(
      actionsList.setTreeDetailToUpdate({
        treeIdToUpdate: treeDetail.id,
        tree: treeDetail as any,
        location: treeCoordsLocation,
      }),
    ).toEqual(expectedAction);
  });
});
