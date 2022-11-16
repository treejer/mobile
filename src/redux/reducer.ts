import {combineReducers} from 'redux';

import {initReducer} from 'ranger-redux/modules/init/init';
import {web3Reducer} from 'ranger-redux/modules/web3/web3';
import {netInfoReducer} from 'ranger-redux/modules/netInfo/netInfo';
import {settingsReducer} from 'ranger-redux/modules/settings/settings';
import {contractsReducer} from 'ranger-redux/modules/contracts/contracts';
import {profileReducer} from 'ranger-redux/modules/profile/profile';
import {userSignReducer} from 'ranger-redux/modules/userSign/userSign';
import {userNonceReducer} from 'ranger-redux/modules/userNonce/userNonce';
import {countriesReducer} from 'ranger-redux/modules/countris/countries';
import {offlineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import {recentPlacesReducer} from 'ranger-redux/modules/recentPlaces/recentPlaces';

const appReducer = combineReducers({
  init: initReducer,
  web3: web3Reducer,
  netInfo: netInfoReducer,
  settings: settingsReducer,
  contracts: contractsReducer,
  recentPlaces: recentPlacesReducer,
  profile: profileReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  countries: countriesReducer,
  offlineMap,
});

export default appReducer;
