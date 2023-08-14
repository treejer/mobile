import {Image} from 'react-native-image-crop-picker';

import {Tree} from 'types';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {CurrentJourneyAction, TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

export const START_PLANT_SINGLE_TREE = 'START_PLANT_SINGLE_TREE';
export const startPlantSingleTree = () => ({
  type: START_PLANT_SINGLE_TREE,
});

export type StartPlantAssignedTreeArgs = {
  treeIdToPlant: string;
  tree: TCurrentJourney['tree'];
};
export const START_PLANT_ASSIGNED_TREE = 'START_PLANT_ASSIGNED_TREE';
export const startPlantAssignedTree = ({treeIdToPlant, tree}: StartPlantAssignedTreeArgs) => ({
  type: START_PLANT_ASSIGNED_TREE,
  treeIdToPlant,
  tree,
});

export type StartPlantNurseryArgs = {
  count: number;
};
export const START_PLANT_NURSERY = 'START_PLANT_NURSERY';
export const startPlantNursery = ({count}: StartPlantNurseryArgs) => ({
  type: START_PLANT_NURSERY,
  nurseryCount: count,
});

export type SetTreeLocationArgs = {
  coords?: TUserLocation;
};
export const SET_TREE_LOCATION = 'SET_TREE_LOCATION';
export const setTreeLocation = ({coords}: SetTreeLocationArgs) => ({
  type: SET_TREE_LOCATION,
  location: coords,
});

export type SetTreePhotoArgs = {
  photo?: Image | File;
  photoLocation?: TUserLocation;
};

export const SET_TREE_PHOTO = 'SET_TREE_PHOTO';
export const setTreePhoto = ({photo, photoLocation}: SetTreePhotoArgs) => ({
  type: SET_TREE_PHOTO,
  photo: photo,
  photoLocation,
});

export const DISCARD_UPDATE_NURSERY_LOCATION = 'DISCARD_UPDATE_NURSERY_LOCATION';
export const discardUpdateNurseryLocation = () => ({
  type: DISCARD_UPDATE_NURSERY_LOCATION,
});

export type SetTreeDetailToUpdateArgs = {
  treeIdToUpdate: string;
  tree: TCurrentJourney['tree'];
};
export const SET_TREE_DETAIL_TO_UPDATE = 'SET_TREE_DETAIL_TO_UPDATE';
export const setTreeDetailToUpdate = ({treeIdToUpdate, tree}: SetTreeDetailToUpdateArgs) => ({
  type: SET_TREE_DETAIL_TO_UPDATE,
  treeIdToUpdate,
  tree,
});

export const CLEAR_JOURNEY = 'CLEAR_JOURNEY';
export const clearJourney = () => ({
  type: CLEAR_JOURNEY,
});

export const REMOVE_JOURNEY_PHOTO = 'REMOVE_JOURNEY_PHOTO';
export const removeJourneyPhoto = () => ({
  type: REMOVE_JOURNEY_PHOTO,
});

export const REMOVE_JOURNEY_LOCATION = 'REMOVE_JOURNEY_LOCATION';
export const removeJourneyLocation = () => ({
  type: REMOVE_JOURNEY_LOCATION,
});

export type SetJourneyFromDraftsArgs = {
  journey: TCurrentJourney;
};
export const SET_JOURNEY_FROM_DRAFTS = 'SET_JOURNEY_FROM_DRAFTS';
export const setJourneyFromDrafts = ({journey}: SetJourneyFromDraftsArgs) => ({
  type: SET_JOURNEY_FROM_DRAFTS,
  journey,
});

export const SET_SUBMIT_JOURNEY_LOADING = 'SET_SUBMIT_JOURNEY_LOADING';
export const setSubmitJourneyLoading = (loading: boolean) => ({
  type: SET_SUBMIT_JOURNEY_LOADING,
  loading,
});

// * saga watcher actions
export type AssignJourneyTreePhotoPayload = Pick<
  CurrentJourneyAction,
  'imageBase64' | 'photo' | 'photoLocation' | 'userLocation' | 'fromGallery'
>;
export const ASSIGN_JOURNEY_TREE_PHOTO_WATCHER = 'ASSIGN_JOURNEY_TREE_PHOTO_WATCHER';
export const assignJourneyTreePhotoWatcher = ({
  photo,
  photoLocation,
  userLocation,
  fromGallery,
  imageBase64,
}: AssignJourneyTreePhotoPayload) => ({
  type: ASSIGN_JOURNEY_TREE_PHOTO_WATCHER,
  photo,
  photoLocation,
  userLocation,
  fromGallery,
  imageBase64,
});

export type AssignJourneyTreeLocationPayload = Pick<CurrentJourneyAction, 'location'>;
export const ASSIGN_JOURNEY_TREE_LOCATION_WATCHER = 'ASSIGN_JOURNEY_TREE_LOCATION_WATCHER';
export const assignJourneyTreeLocationWatcher = ({location}: AssignJourneyTreeLocationPayload) => ({
  type: ASSIGN_JOURNEY_TREE_LOCATION_WATCHER,
  location,
});

export const SUBMIT_JOURNEY_WATCHER = 'SUBMIT_JOURNEY_WATCHER';
export const submitJourneyWatcher = () => ({
  type: SUBMIT_JOURNEY_WATCHER,
});
