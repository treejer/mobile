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
  it('assign tree photo watcher action', () => {
    const location = {
      latitude: 22000,
      longitude: 3213213123,
    };
    const expectedAction = {
      type: actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER,
      photo: onBoardingOne,
      photoLocation: location,
      userLocation: location,
      fromGallery: false,
    };
    expect(
      actionsList.assignJourneyTreePhotoWatcher({
        photo: onBoardingOne,
        photoLocation: location,
        userLocation: location,
        fromGallery: false,
      }),
    ).toEqual(expectedAction);
  });
  it('assign tree location watcher action', () => {
    const location = {
      latitude: 22000,
      longitude: 3213213123,
    };
    const expectedAction = {
      type: actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER,
      location,
    };
    expect(actionsList.assignJourneyTreeLocationWatcher({location})).toEqual(expectedAction);
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
    };
    expect(
      actionsList.setTreePhoto({
        photo: treePhoto,
        photoLocation: treeCoordsLocation,
      }),
    ).toEqual(expectedAction);
  });
  it('discard update nursery location', () => {
    const expectedAction = {
      type: actionsList.DISCARD_UPDATE_NURSERY_LOCATION,
    };
    expect(actionsList.discardUpdateNurseryLocation()).toEqual(expectedAction);
  });
  it('update & set tree detail', () => {
    const expectedAction = {
      type: actionsList.SET_TREE_DETAIL_TO_UPDATE,
      treeIdToUpdate: treeDetail.id,
      tree: treeDetail,
    };

    expect(
      actionsList.setTreeDetailToUpdate({
        treeIdToUpdate: treeDetail.id,
        tree: treeDetail as any,
      }),
    ).toEqual(expectedAction);
  });
  it('clear journey', () => {
    const expectedAction = {
      type: actionsList.CLEAR_JOURNEY,
    };
    expect(actionsList.clearJourney()).toEqual(expectedAction);
  });
  it('remove journey photo', () => {
    const expectedAction = {
      type: actionsList.REMOVE_JOURNEY_PHOTO,
    };
    expect(actionsList.removeJourneyPhoto()).toEqual(expectedAction);
  });
  it('remove journey location', () => {
    const expectedAction = {
      type: actionsList.REMOVE_JOURNEY_LOCATION,
    };
    expect(actionsList.removeJourneyLocation()).toEqual(expectedAction);
  });
  it('set journey from drafts', () => {
    const expectedAction = {
      type: actionsList.SET_JOURNEY_FROM_DRAFTS,
      journey: {
        location: {
          latitude: 2000,
          longitude: 232323,
        },
        isNursery: false,
        isSingle: true,
        isUpdate: false,
      },
    };
    expect(actionsList.setJourneyFromDrafts({journey: expectedAction.journey})).toEqual(expectedAction);
  });
  it('set submit journey loading = true', () => {
    const expectedAction = {
      type: actionsList.SET_SUBMIT_JOURNEY_LOADING,
      loading: true,
    };
    expect(actionsList.setSubmitJourneyLoading(true)).toEqual(expectedAction);
  });
  it('set submit journey loading = false', () => {
    const expectedAction = {
      type: actionsList.SET_SUBMIT_JOURNEY_LOADING,
      loading: false,
    };
    expect(actionsList.setSubmitJourneyLoading(false)).toEqual(expectedAction);
  });
  it('submit journey', () => {
    const expectedAction = {
      type: actionsList.SUBMIT_JOURNEY_WATCHER,
    };
    expect(actionsList.submitJourneyWatcher()).toEqual(expectedAction);
  });
});
