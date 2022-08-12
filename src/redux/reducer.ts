import {combineReducers} from 'redux';

import {tokenReducer} from './modules/token/token';
import {clientAuth} from 'redux/modules/auth/clientAuth';
import {initReducer} from 'redux/modules/init/init';
import {settingsReducer} from 'redux/modules/settings/settings';

const appReducer = combineReducers({
  token: tokenReducer,
  clientAuth,
  init: initReducer,
  settings: settingsReducer,
});

export default appReducer;
