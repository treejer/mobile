import {combineReducers} from 'redux';

import {tokenReducer} from './modules/token/token';
import {clientAuth} from './modules/auth/clientAuth';
import {initReducer} from './modules/init/init';
import {settingsReducer} from './modules/settings/settings';
import {web3Reducer} from 'redux/modules/web3/web3';
import {userSignReducer} from 'redux/modules/userSign/userSign';
import {userNonceReducer} from 'redux/modules/userNonce/userNonce';
import {netInfoReducer} from 'redux/modules/netInfo/netInfo';
// import {userSignReducer} from 'redux/modules/userSign/userSign';
// import { userNonceReducer } from 'redux/modules/userNonce/userNonce';

const appReducer = combineReducers({
  token: tokenReducer,
  clientAuth,
  init: initReducer,
  settings: settingsReducer,
  web3: web3Reducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  netInfo: netInfoReducer,
});

export default appReducer;
