import {Image} from 'react-native-image-crop-picker';

import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {Tree} from 'types';

export const START_PLANT_SINGLE_TREE = 'START_PLANT_SINGLE_TREE';
export const startPlantSingleTree = () => ({
  type: START_PLANT_SINGLE_TREE,
});

export type StartPlantAssignedTreeArgs = {
  treeIdToPlant: string;
  tree: Tree;
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
  coords: TUserLocation;
};
export const SET_TREE_LOCATION = 'SET_TREE_LOCATION';
export const setTreeLocation = ({coords}: SetTreeLocationArgs) => ({
  type: SET_TREE_LOCATION,
  location: coords,
});

export type SetTreePhotoArgs = {
  photo: Image | File;
  discardUpdateLocation?: boolean;
  photoLocation: TUserLocation;
};
export const SET_TREE_PHOTO = 'SET_TREE_PHOTO';
export const setTreePhoto = ({photo, photoLocation, discardUpdateLocation = false}: SetTreePhotoArgs) => ({
  type: SET_TREE_PHOTO,
  photo: photo,
  discardUpdateLocation,
  photoLocation,
});

export const DISCARD_UPDATE_NURSERY_LOCATION = 'DISCARD_UPDATE_NURSERY_LOCATION';
export const discardUpdateNurseryLocation = () => ({
  type: DISCARD_UPDATE_NURSERY_LOCATION,
});

export type TreeDetailToUpdateArgs = {
  treeIdToUpdate: string;
  tree: Tree;
  location: TUserLocation;
};
export const SET_TREE_DETAIL_TO_UPDATE = 'SET_TREE_DETAIL_TO_UPDATE';
export const setTreeDetailToUpdate = ({treeIdToUpdate, tree, location}: TreeDetailToUpdateArgs) => ({
  type: SET_TREE_DETAIL_TO_UPDATE,
  treeIdToUpdate,
  tree,
  location,
});

export const CLEAR_JOURNEY = 'CLEAR_JOURNEY';
export const clearJourney = () => ({
  type: CLEAR_JOURNEY,
});
