import {useCallback} from 'react';
import {Image} from 'react-native-image-crop-picker';

import {TreeJourney_V2} from 'screens/TreeSubmissionV2/types';
import {Tree} from 'types';
import {TPoint} from 'utilities/helpers/distanceInMeters';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';

export enum JourneyMetadata {
  Photo = 'photo',
  Location = 'location',
}

export type TCurrentJourney = TreeJourney_V2;

export type CurrentJourneyAction = {
  type: string;
  nurseryCount?: number;
  location?: TPoint;
  photo?: Image | File;
  discardUpdateLocation?: boolean;
  imageBase64?: string;
  fromGallery?: boolean;
  userLocation?: TPoint;
  photoLocation?: TPoint;
  tree?: Tree;
  treeIdToUpdate?: string;
  treeIdToPlant?: string;
  journey?: TCurrentJourney;
};

export const currentJourneyInitialState: TCurrentJourney = {};

export const currentJourneyReducer = (
  state: TCurrentJourney = currentJourneyInitialState,
  action: CurrentJourneyAction,
): TCurrentJourney => {
  switch (action.type) {
    case actionsList.START_PLANT_SINGLE_TREE:
      return {
        ...state,
        isSingle: true,
        isNursery: false,
        isUpdate: false,
      };
    case actionsList.START_PLANT_ASSIGNED_TREE:
      return {
        ...state,
        isSingle: true,
        isNursery: false,
        isUpdate: false,
        tree: action.tree,
        treeIdToPlant: action.treeIdToPlant,
      };
    case actionsList.START_PLANT_NURSERY:
      return {
        ...state,
        isSingle: false,
        isNursery: true,
        isUpdate: false,
        nurseryCount: action.nurseryCount,
      };
    case actionsList.SET_TREE_PHOTO:
      return {
        ...state,
        photo: action.photo,
        photoLocation: action.photoLocation,
        nurseryContinuedUpdatingLocation: action.discardUpdateLocation,
      };
    case actionsList.SET_TREE_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    case actionsList.DISCARD_UPDATE_NURSERY_LOCATION:
      return {
        ...state,
        nurseryContinuedUpdatingLocation: true,
      };
    case actionsList.SET_TREE_DETAIL_TO_UPDATE:
      return {
        ...state,
        treeIdToUpdate: action.treeIdToUpdate,
        tree: action.tree,
        location: action.location,
      };

    case actionsList.REMOVE_JOURNEY_LOCATION:
      return {
        ...state,
        location: undefined,
      };

    case actionsList.REMOVE_JOURNEY_PHOTO:
      return {
        ...state,
        photo: undefined,
        photoLocation: undefined,
      };
    case actionsList.SET_JOURNEY_FROM_DRAFTS:
      return action.journey || state;
    case actionsList.CLEAR_JOURNEY:
      return currentJourneyInitialState;
    default:
      return state;
  }
};

export function useCurrentJourney() {
  const journey = useAppSelector(state => state.currentJourney);
  const dispatch = useAppDispatch();

  const dispatchStartPlantSingleTree = useCallback(() => {
    dispatch(actionsList.startPlantSingleTree());
  }, [dispatch]);

  const dispatchStartPlantNursery = useCallback(
    (args: actionsList.StartPlantNurseryArgs) => {
      dispatch(actionsList.startPlantNursery(args));
    },
    [dispatch],
  );

  const dispatchClearJourney = useCallback(() => {
    dispatch(actionsList.clearJourney());
  }, [dispatch]);

  const dispatchSelectTreePhoto = useCallback(
    (args: actionsList.AssignJourneyTreePhotoPayload) => {
      dispatch(actionsList.assignJourneyTreePhotoWatcher(args));
    },
    [dispatch],
  );

  const dispatchSelectTreeLocation = useCallback(
    (args: actionsList.AssignJourneyTreeLocationPayload) => {
      dispatch(actionsList.assignJourneyTreeLocationWatcher(args));
    },
    [dispatch],
  );

  return {
    journey,
    dispatchClearJourney,
    dispatchStartPlantSingleTree,
    dispatchStartPlantNursery,
    dispatchSelectTreeLocation,
    dispatchSelectTreePhoto,
  };
}
