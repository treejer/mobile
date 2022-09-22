import {combineReducers} from 'redux';

import {initReducer} from './modules/init/init';
import {web3Reducer} from './modules/web3/web3';
import {netInfoReducer} from './modules/netInfo/netInfo';
import {settingsReducer} from './modules/settings/settings';
import {contractsReducer} from './modules/contracts/contracts';
import {profileReducer} from './modules/profile/profile';
import {userSignReducer} from './modules/userSign/userSign';
import {userNonceReducer} from './modules/userNonce/userNonce';

const appReducer = combineReducers({
  init: initReducer,
  web3: web3Reducer,
  netInfo: netInfoReducer,
  settings: settingsReducer,
  contracts: contractsReducer,
  profile: profileReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
});

export default appReducer;
