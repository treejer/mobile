import {combineReducers} from 'redux';

import {clientAuth} from './modules/auth/clientAuth';
import {initReducer} from './modules/init/init';
import {settingsReducer} from './modules/settings/settings';
import {web3Reducer} from './modules/web3/web3';
import {userSignReducer} from './modules/userSign/userSign';
import {userNonceReducer} from './modules/userNonce/userNonce';
import {netInfoReducer} from './modules/netInfo/netInfo';
import {userReducer} from './modules/profile/_user';
import {profileReducer} from './modules/profile/profile';

const appReducer = combineReducers({
  clientAuth,
  init: initReducer,
  settings: settingsReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  netInfo: netInfoReducer,
  web3: web3Reducer,
  user: userReducer,
  profile: profileReducer,
});

export default appReducer;
