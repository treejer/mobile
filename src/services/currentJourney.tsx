import React, {useContext, useEffect, useReducer} from 'react';
import {TreeJourney} from 'screens/TreeSubmission/types';

const CurrentJourneyContext = React.createContext<TreeJourney>({
  location: {
    latitude: 0,
    longitude: 0,
  },
});
const CurrentJourneyDispatcherContext = React.createContext<React.Dispatch<currentJourneyActionType>>(null!);

interface currentJourneyActionType {
  type: 'SET-NEW-JOURNEY' | 'CLEAR-JOURNEY';
  payload?: any;
}

const initialValue = {
  location: {
    latitude: 0,
    longitude: 0,
  },
};

const reducer = (state: TreeJourney, action: currentJourneyActionType) => {
  switch (action.type) {
    case 'SET-NEW-JOURNEY': {
      return action.payload;
    }
    case 'CLEAR-JOURNEY': {
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

  useEffect(() => {
    console.log('====================================');
    console.log(journey, '<==== journey is here');
    console.log('====================================');
  }, [journey]);

  return (
    <CurrentJourneyContext.Provider value={journey}>
      <CurrentJourneyDispatcherContext.Provider value={dispatch}>{children}</CurrentJourneyDispatcherContext.Provider>
    </CurrentJourneyContext.Provider>
  );
}

export const useCurrentJourney = () => useContext(CurrentJourneyContext);
export const useCurrentJourneyAction = () => useContext(CurrentJourneyDispatcherContext);
