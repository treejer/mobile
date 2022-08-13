import {combineReducers} from 'redux';

import {tokenReducer} from './modules/token/token';
import {clientAuth} from './modules/auth/clientAuth';
import {initReducer} from './modules/init/init';
import {settingsReducer} from './modules/settings/settings';
import {web3Reducer} from './modules/web3/web3';
import {userSignReducer} from './modules/userSign/userSign';
import {userNonceReducer} from './modules/userNonce/userNonce';
import {netInfoReducer} from './modules/netInfo/netInfo';

const appReducer = combineReducers({
  token: tokenReducer,
  clientAuth,
  init: initReducer,
  settings: settingsReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  netInfo: netInfoReducer,
  web3: web3Reducer,
});

export default appReducer;
