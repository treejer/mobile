import React, {useEffect, useState} from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import appReducer from 'ranger-redux/reducer';
import {initialWeb3State} from 'ranger-redux/modules/web3/web3';
import {reducerInitiator, storeGenerator} from 'ranger-redux/store';
import {navigationContainerRef} from 'navigation/navigationRef';
import {MockedProvider, MockedProviderProps} from '@apollo/client/testing';

type AppReducer = Partial<ReturnType<typeof appReducer>>;

export type Props = {
  initialState: AppReducer;
  apolloState: MockedProviderProps['mocks'];
  children?: JSX.Element | JSX.Element[];
};

const TestApp = ({initialState, children}: Props) => {
  const [store, setStore] = useState<any>();

  useEffect(() => {
    setStore(storeGenerator(reducerInitiator(initialState, {})).store);
  }, []);

  if (!store) {
    return null;
  }
  return (
    <Provider store={store}>
      {/*<ApolloProvider>*/}
      {/*<CurrentJourneyProvider>*/}
      <NavigationContainer ref={navigationContainerRef}>{children}</NavigationContainer>
      {/*</CurrentJourneyProvider>*/}
      {/*</ApolloProvider>*/}
    </Provider>
  );
};

const reducers = {
  contracts: {dai: '', ether: '', fee: null, loading: false, submitting: false},
  countries: {data: null, error: null, form: undefined, loaded: undefined, loading: true},
  init: {loading: false},
  netInfo: {isConnected: true},
  settings: {
    checkMetaData: true,
    locale: 'en',
    onBoardingDone: false,
    releaseDate: 1672159176038,
    showSupportChat: false,
    useBiconomy: true,
  },
  offlineMap: {
    packs: Array(0),
    loading: false,
    downloadingPack: null,
  },
  profile: {
    data: null,
    error: null,
    form: null,
    loaded: false,
    loading: false,
  },
  recentPlaces: {
    recentPlaces: null,
  },
  searchPlaces: {
    data: null,
    error: null,
    form: null,
    loaded: false,
    loading: false,
  },
  userNonce: {
    data: null,
    error: null,
    form: null,
    loaded: false,
    loading: false,
  },
  userSign: {
    data: null,
    error: null,
    form: null,
    loaded: false,
    loading: false,
  },
  web: initialWeb3State,
};

export const AllTheProviders = ({children, initialState, apolloState}: Props) => {
  const [store, setStore] = useState<any>();

  useEffect(() => {
    setStore(storeGenerator(reducerInitiator(initialState, {})).store);
  }, []);

  if (!store) {
    return null;
  }
  return (
    <Provider store={store}>
      <MockedProvider mocks={apolloState} addTypename>
        <NavigationContainer ref={navigationContainerRef}>{children}</NavigationContainer>
      </MockedProvider>
    </Provider>
  );
};

const customRender = (ui, initialState, apolloState: any[] = [], options = {}) =>
  render(ui, {
    wrapper: props => <AllTheProviders {...props} initialState={initialState} apolloState={apolloState} />,
    ...options,
  });

const renderTestApp = (initialState, options = {}) =>
  render(<TestApp initialState={initialState} apolloState={[]} />, {
    ...options,
  });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export {customRender as render, renderTestApp};
