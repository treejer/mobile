import {combineReducers} from 'redux';

import {tokenReducer} from './modules/token/token';
import {clientAuth} from './modules/auth/clientAuth';
import {initReducer} from './modules/init/init';
import {settingsReducer} from './modules/settings/settings';

const appReducer = combineReducers({
  token: tokenReducer,
  clientAuth,
  init: initReducer,
  settings: settingsReducer,
});

export default appReducer;
