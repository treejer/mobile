import {all} from 'redux-saga/effects';

import {TStoreRedux} from 'ranger-redux/store';
import {web3Sagas} from 'ranger-redux/modules/web3/web3';
import {initSagas} from 'ranger-redux/modules/init/init';
import {paginationSagas} from 'ranger-redux/modules/pagination/pagination.saga';
import {userNonceSagas} from 'ranger-redux/modules/userNonce/userNonce';
import {userSignSagas} from 'ranger-redux/modules/userSign/userSign';
import {netInfoSagas} from 'ranger-redux/modules/netInfo/netInfo';
import {profileSagas} from 'ranger-redux/modules/profile/profile';
import {contractsSagas} from 'ranger-redux/modules/contracts/contracts';
import {offlineMapSagas} from 'ranger-redux/modules/offlineMap/offlineMap';
import {searchPlacesSagas} from 'ranger-redux/modules/searchPlaces/searchPlaces';
import {draftedJourneysSagas} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.saga';
import {currentJourneySagas} from 'ranger-redux/modules/currentJourney/currentJourney.saga';
import {mobileSendCodeSagas} from 'ranger-redux/modules/verification/mobileSendCode';
import {mobileResendCodeSagas} from 'ranger-redux/modules/verification/mobileResendCode';
import {verifyMobileSagas} from 'ranger-redux/modules/verification/verifyMoblie';
import {verifyProfileSagas} from 'ranger-redux/modules/verification/verifyProfile';
import {plantTreeSagas} from 'ranger-redux/modules/submitTreeEvents/plantTree';
import {assignedTreeSagas} from 'ranger-redux/modules/submitTreeEvents/assignedTree';
import {updateTreeSagas} from 'ranger-redux/modules/submitTreeEvents/updateTree';
import {treeDetailsSagas} from 'ranger-redux/modules/trees/treeDetails';
import {deleteTreeEventSagas} from 'ranger-redux/modules/submitTreeEvents/deleteTreeEvent';
import {plantedTreesSagas} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesSagas} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesSagas} from 'ranger-redux/modules/trees/assignedTrees';
import {pendingTreeIdsSagas} from 'ranger-redux/modules/trees/pendingTreeIds';

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
    offlineMapSagas(store),
    searchPlacesSagas(),
    mobileSendCodeSagas(),
    mobileResendCodeSagas(),
    verifyMobileSagas(),
    verifyProfileSagas(),
    plantTreeSagas(),
    assignedTreeSagas(),
    updateTreeSagas(),
    treeDetailsSagas(),
    plantedTreesSagas(),
    assignedTreesSagas(),
    updatedTreesSagas(),
    pendingTreeIdsSagas(),
    deleteTreeEventSagas(),
  ]);
}
