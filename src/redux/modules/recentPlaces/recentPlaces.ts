import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {TPlace} from 'components/Map/types';

export type TRecentPlacesState = {
  recentPlaces: TPlace[] | null;
};

export type TRecentPlacesAction = {
  type: string;
  newPlace: TPlace;
};

export const recentPlacesInitialState = {
  recentPlaces: null,
};

export const ADD_NEW_PLACE = 'ADD_NEW_PLACE';
export function addNewPlace(newPlace: TPlace) {
  return {
    type: ADD_NEW_PLACE,
    newPlace,
  };
}

export function recentPlacesReducer(
  state: TRecentPlacesState = recentPlacesInitialState,
  action: TRecentPlacesAction,
): TRecentPlacesState {
  switch (action.type) {
    case ADD_NEW_PLACE: {
      const cloneRecentPlaces = [...(state.recentPlaces || [])];
      if (cloneRecentPlaces.find(place => place.id === action.newPlace.id)) {
        return state;
      }
      if (cloneRecentPlaces.length === 7) {
        cloneRecentPlaces.shift();
      }
      cloneRecentPlaces.push(action.newPlace);
      return {
        recentPlaces: cloneRecentPlaces,
      };
    }
    default: {
      return state;
    }
  }
}

export function useRecentPlaces() {
  const recentPlaces = useAppSelector(state => state.recentPlaces);
  const dispatch = useAppDispatch();

  const dispatchAddNewPlace = useCallback(
    (newPlace: TPlace) => {
      dispatch(addNewPlace(newPlace));
    },
    [dispatch],
  );

  return {
    ...recentPlaces,
    dispatchAddNewPlace,
  };
}
