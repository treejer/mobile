import {createStore, applyMiddleware, Middleware, Store} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {createBlacklistFilter} from 'redux-persist-transform-filter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import {reduxLogger} from 'services/config';
import {RESET_REDUX_PERSIST} from 'ranger-redux/modules/appInfo/appInfo';
import appReducer from './reducer';
import saga from './saga';

export const reducerInitiator = (state, action) => {
  return () => appReducer(state, action);
};

const saveSubsetBlacklistFilter = createBlacklistFilter('web3', [
  'magic',
  'web3',
  'treeFactory',
  'planter',
  'planterFund',
  'accessRestriction',
]);

const persistConfig = {
  key: 'RangerTreejerPersist',
  storage: AsyncStorage,
  whitelist: [
    'appInfo',
    'settings',
    'web3',
    'profile',
    'contracts',
    'offlineMap',
    'recentPlaces',
    'draftedJourneys',
    'countries',
    'plantedTrees',
    'updatedTrees',
    'assignedTrees',
  ],
  transforms: [saveSubsetBlacklistFilter],
};

const persistedReducer = persistReducer(persistConfig, (state, action: {type: string; payload: any}) => {
  if (action.type === RESET_REDUX_PERSIST) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
});

export const sagaMiddleware = createSagaMiddleware();
const middlewares: Array<Middleware> = [sagaMiddleware];

if (reduxLogger) {
  middlewares.push(logger);
}

export const storeGenerator = reducer => {
  const store = createStore(reducer, applyMiddleware(...middlewares));
  const persistor = persistStore(store);

  sagaMiddleware.run(saga, store as TStoreRedux);

  return {
    store,
    persistor,
  };
};

const {store, persistor} = storeGenerator(persistedReducer);

export type TReduxState = ReturnType<typeof appReducer>;
export type TAppDispatch = typeof store.dispatch;
export type TStoreRedux = Store<TReduxState>;

export {store, persistor};
