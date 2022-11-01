import {all} from 'redux-saga/effects';
import {web3Sagas} from './modules/web3/web3';
import {TStoreRedux} from './store';
import {initSagas} from './modules/init/init';
import {userNonceSagas} from './modules/userNonce/userNonce';
import {userSignSagas} from './modules/userSign/userSign';
import {netInfoSagas} from './modules/netInfo/netInfo';
import {profileSagas} from './modules/profile/profile';
import {contractsSagas} from './modules/contracts/contracts';
import {countriesSagas} from './modules/countris/countries';
import {offlineMapSagas} from 'ranger-redux/modules/offlineMap/offlineMap';

export default function* root(store: TStoreRedux) {
  yield all([
    initSagas(),
    web3Sagas(store),
    userNonceSagas(),
    userSignSagas(),
    netInfoSagas(store),
    profileSagas(),
    contractsSagas(),
    countriesSagas(),
    offlineMapSagas(store),
  ]);
}
