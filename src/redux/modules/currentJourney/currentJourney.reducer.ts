import {useCallback} from 'react';
import {Image} from 'react-native-image-crop-picker';

import {TreeJourney_V2} from 'screens/TreeSubmissionV2/types';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {Tree} from 'types';
import * as actionsList from 'ranger-redux/modules/currentJourney/currentJourney.action';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {
  clearJourney,
  setTreeLocation,
  SetTreeLocationArgs,
  setTreePhoto,
  SetTreePhotoArgs,
  startPlantNursery,
  StartPlantNurseryArgs,
  startPlantSingleTree,
} from 'ranger-redux/modules/currentJourney/currentJourney.action';

export type TCurrentJourney = TreeJourney_V2;

export type CurrentJourneyAction = {
  type: string;
  nurseryCount?: number;
  location?: TUserLocation;
  photo?: Image | File;
  discardUpdateLocation?: boolean;
  photoLocation?: TUserLocation;
  tree?: Tree;
  treeIdToUpdate?: string;
  treeIdToPlant?: string;
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
    dispatch(startPlantSingleTree());
  }, [dispatch]);

  const dispatchStartPlantNursery = useCallback(
    (args: StartPlantNurseryArgs) => {
      dispatch(startPlantNursery(args));
    },
    [dispatch],
  );

  const dispatchClearJourney = useCallback(() => {
    dispatch(clearJourney());
  }, [dispatch]);

  const dispatchSelectTreeLocation = useCallback(
    (args: SetTreeLocationArgs) => {
      dispatch(setTreeLocation(args));
    },
    [dispatch],
  );

  const dispatchSelectTreePhoto = useCallback(
    (args: SetTreePhotoArgs) => {
      dispatch(setTreePhoto(args));
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
