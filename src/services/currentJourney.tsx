import React, {useContext, useReducer} from 'react';
import {TreeJourney} from 'screens/TreeSubmission/types';

const CurrentJourneyContext = React.createContext<TreeJourney>({
  location: {
    latitude: 0,
    longitude: 0,
  },
});
const CurrentJourneyDispatcherContext = React.createContext<React.Dispatch<TreeJourney> | null>(null);

const initialValue = {
  location: {
    latitude: 0,
    longitude: 0,
  },
};

const reducer = (state: TreeJourney, action) => {
  switch (action.type) {
    case 'SET-NEW-JOURNEY': {
      return state;
    }
    case 'CLEAR-JOURNEY': {
      return state;
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
  return (
    <CurrentJourneyContext.Provider value={journey}>
      <CurrentJourneyDispatcherContext.Provider value={dispatch}>{children}</CurrentJourneyDispatcherContext.Provider>
    </CurrentJourneyContext.Provider>
  );
}

export const useCurrentJourney = () => useContext(CurrentJourneyContext);
export const useCurrentJourneyAction = () => useContext(CurrentJourneyDispatcherContext);
