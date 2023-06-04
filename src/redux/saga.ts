import {all} from 'redux-saga/effects';

import {TStoreRedux} from './store';
import {web3Sagas} from './modules/web3/web3';
import {initSagas} from './modules/init/init';
import {paginationSagas} from './modules/pagination/pagination.saga';
import {userNonceSagas} from './modules/userNonce/userNonce';
import {userSignSagas} from './modules/userSign/userSign';
import {netInfoSagas} from './modules/netInfo/netInfo';
import {profileSagas} from './modules/profile/profile';
import {contractsSagas} from './modules/contracts/contracts';
import {countriesSagas} from './modules/countris/countries';
import {offlineMapSagas} from './modules/offlineMap/offlineMap';
import {searchPlacesSagas} from './modules/searchPlaces/searchPlaces';
import {draftedJourneysSagas} from './modules/draftedJourneys/draftedJourneys.saga';
import {currentJourneySagas} from './modules/currentJourney/currentJourney.saga';
import {mobileSendCodeSagas} from './modules/verification/mobileSendCode';
import {mobileResendCodeSagas} from './modules/verification/mobileResendCode';
import {verifyMobileSagas} from './modules/verification/verifyMoblie';
import {verifyProfileSagas} from './modules/verification/verifyProfile';
import {plantTreeSagas} from './modules/submitTreeEvents/plantTree';
import {assignedTreeSagas} from './modules/submitTreeEvents/assignedTree';
import {updateTreeSagas} from './modules/submitTreeEvents/updateTree';
import {treeDetailSagas} from './modules/trees/treeDetail';
import {deleteTreeEventSagas} from './modules/submitTreeEvents/deleteTreeEvent';
import {plantedTreesSagas} from './modules/trees/plantedTrees';
import {updatedTreesSagas} from './modules/trees/updatedTrees';
import {assignedTreesSagas} from './modules/trees/assignedTrees';

export default function* root(store: TStoreRedux) {
  yield all([
    paginationSagas(),
    initSagas(),
    web3Sagas(store),
    currentJourneySagas(),
    draftedJourneysSagas(),
    userNonceSagas(),
    userSignSagas(),
    netInfoSagas(store),
    profileSagas(),
    contractsSagas(),
    countriesSagas(),
    offlineMapSagas(store),
    searchPlacesSagas(),
    mobileSendCodeSagas(),
    mobileResendCodeSagas(),
    verifyMobileSagas(),
    verifyProfileSagas(),
    plantTreeSagas(),
    assignedTreeSagas(),
    updateTreeSagas(),
    treeDetailSagas(),
    plantedTreesSagas(),
    assignedTreesSagas(),
    updatedTreesSagas(),
    deleteTreeEventSagas(),
  ]);
}
