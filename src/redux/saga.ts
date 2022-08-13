import {all} from 'redux-saga/effects';
import {web3Sagas} from './modules/web3/web3';
import {TStoreRedux} from 'redux/store';
import {initSagas} from './modules/init/init';
import {userNonceSagas} from './modules/userNonce/userNonce';
import {userSignSagas} from './modules/userSign/userSign';

export default function* root(store: TStoreRedux) {
  yield all([initSagas(), web3Sagas(), userNonceSagas(), userSignSagas()]);
}
