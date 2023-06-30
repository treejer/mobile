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

export const RESET_RECENT_PLACES = 'RESET_RECENT_PLACES';
export function resetRecentPlaces() {
  return {
    type: RESET_RECENT_PLACES,
  };
}

export function recentPlacesReducer(
  state: TRecentPlacesState = recentPlacesInitialState,
  action: TRecentPlacesAction,
): TRecentPlacesState {
  switch (action.type) {
    case ADD_NEW_PLACE: {
      let cloneRecentPlaces = [...(state.recentPlaces || [])];

      // * if the searched place was repeated will not add to the recent places list and will move to the beginning of the array
      const isExist = cloneRecentPlaces.some(place => place.id === action.newPlace.id);
      if (isExist) {
        cloneRecentPlaces = cloneRecentPlaces.filter(place => place.id !== action.newPlace.id);
        cloneRecentPlaces.unshift(action.newPlace);
      } else {
        // * if array length was greater than 14 (or equal to 15), the last item of array will remove
        if (cloneRecentPlaces.length > 14) {
          cloneRecentPlaces.pop();
        }
        // * new place will add to the beginning of the recent places list
        cloneRecentPlaces.unshift(action.newPlace);
      }
      return {
        recentPlaces: cloneRecentPlaces,
      };
    }
    case RESET_RECENT_PLACES: {
      return recentPlacesInitialState;
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

  const dispatchResetRecentPlaces = useCallback(() => {
    dispatch(resetRecentPlaces());
  }, [dispatch]);

  return {
    ...recentPlaces,
    dispatchAddNewPlace,
    dispatchResetRecentPlaces,
  };
}
