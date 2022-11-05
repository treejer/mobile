import React, {useCallback, useContext, useMemo, useReducer} from 'react';
import {TreeJourney} from 'screens/TreeSubmission/types';

export const SET_NEW_JOURNEY = 'SET_NEW_JOURNEY';
export const CLEAR_JOURNEY = 'CLEAR_JOURNEY';

const currentJourneyContextInitialValue: CurrentJourneyContextType = {
  journey: {
    location: {
      latitude: 0,
      longitude: 0,
    },
  },
  setNewJourney(newJourney) {},
  clearJourney() {},
};

interface CurrentJourneyContextType {
  journey: TreeJourney;
  setNewJourney: (newJourney: TreeJourney) => void;
  clearJourney: () => void;
}

const CurrentJourneyContext = React.createContext<CurrentJourneyContextType>(currentJourneyContextInitialValue);

interface CurrentJourneyActionType {
  type: string;
  payload?: TreeJourney;
}

const initialValue = {
  location: {
    latitude: 0,
    longitude: 0,
  },
};

const reducer = (state: TreeJourney = initialValue, action: CurrentJourneyActionType): TreeJourney => {
  switch (action.type) {
    case SET_NEW_JOURNEY: {
      return action.payload as TreeJourney;
    }
    case CLEAR_JOURNEY: {
      return initialValue;
    }
    default:
      return state;
  }
};

interface currentJourneyProps {
  children: JSX.Element | JSX.Element[];
}

export default function CurrentJourneyProvider(props: currentJourneyProps) {
  const {children} = props;
  const [journey, dispatch] = useReducer(reducer, initialValue);

  const handleSetNewJourney = useCallback((newJourney: TreeJourney) => {
    dispatch({type: SET_NEW_JOURNEY, payload: newJourney});
  }, []);

  const handleClearJourney = useCallback(() => {
    dispatch({type: CLEAR_JOURNEY});
  }, []);

  const journeyValue = useMemo(
    () => ({journey, setNewJourney: handleSetNewJourney, clearJourney: handleClearJourney}),
    [handleClearJourney, handleSetNewJourney, journey],
  );

  return <CurrentJourneyContext.Provider value={journeyValue}>{children}</CurrentJourneyContext.Provider>;
}

export const useCurrentJourney = () => useContext(CurrentJourneyContext);
