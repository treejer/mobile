import {combineReducers} from 'redux';

import {appInfoReducer} from 'ranger-redux/modules/appInfo/appInfo';
import {initReducer} from 'ranger-redux/modules/init/init';
import {paginationReducer} from 'ranger-redux/modules/pagination/pagination.reducer';
import {web3Reducer} from 'ranger-redux/modules/web3/web3';
import {netInfoReducer} from 'ranger-redux/modules/netInfo/netInfo';
import {settingsReducer} from 'ranger-redux/modules/settings/settings';
import {contractsReducer} from 'ranger-redux/modules/contracts/contracts';
import {profileReducer} from 'ranger-redux/modules/profile/profile';
import {userSignReducer} from 'ranger-redux/modules/userSign/userSign';
import {userNonceReducer} from 'ranger-redux/modules/userNonce/userNonce';
import {offlineMapReducer} from 'ranger-redux/modules/offlineMap/offlineMap';
import {recentPlacesReducer} from 'ranger-redux/modules/recentPlaces/recentPlaces';
import {searchPlacesReducer} from 'ranger-redux/modules/searchPlaces/searchPlaces';
import {currentJourneyReducer} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {browserPlatformReducer} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import {draftedJourneysReducer} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {mobileSendCodeReducer} from 'ranger-redux/modules/verification/mobileSendCode';
import {mobileResendCodeReducer} from 'ranger-redux/modules/verification/mobileResendCode';
import {verifyMobileReducer} from 'ranger-redux/modules/verification/verifyMoblie';
import {verifyProfileReducer} from 'ranger-redux/modules/verification/verifyProfile';
import {plantTreeReducer} from 'ranger-redux/modules/submitTreeEvents/plantTree';
import {assignedTreeReducer} from 'ranger-redux/modules/submitTreeEvents/assignedTree';
import {updateTreeReducer} from 'ranger-redux/modules/submitTreeEvents/updateTree';
import {treeDetailsReducer} from 'ranger-redux/modules/trees/treeDetails';
import {deleteTreeEventReducer} from 'ranger-redux/modules/submitTreeEvents/deleteTreeEvent';
import {plantedTreesReducer} from 'ranger-redux/modules/trees/plantedTrees';
import {updatedTreesReducer} from 'ranger-redux/modules/trees/updatedTrees';
import {assignedTreesReducer} from 'ranger-redux/modules/trees/assignedTrees';
import {pendingTreeIdsReducer} from 'ranger-redux/modules/trees/pendingTreeIds';

const appReducer = combineReducers({
  appInfo: appInfoReducer,
  init: initReducer,
  pagination: paginationReducer,
  web3: web3Reducer,
  netInfo: netInfoReducer,
  settings: settingsReducer,
  contracts: contractsReducer,
  recentPlaces: recentPlacesReducer,
  profile: profileReducer,
  userSign: userSignReducer,
  userNonce: userNonceReducer,
  searchPlaces: searchPlacesReducer,
  currentJourney: currentJourneyReducer,
  browserPlatform: browserPlatformReducer,
  draftedJourneys: draftedJourneysReducer,
  offlineMap: offlineMapReducer,
  mobileSendCode: mobileSendCodeReducer,
  mobileResendCode: mobileResendCodeReducer,
  verifyMobile: verifyMobileReducer,
  verifyProfile: verifyProfileReducer,
  plantTree: plantTreeReducer,
  assignedTree: assignedTreeReducer,
  updateTree: updateTreeReducer,
  treeDetails: treeDetailsReducer,
  plantedTrees: plantedTreesReducer,
  updatedTrees: updatedTreesReducer,
  assignedTrees: assignedTreesReducer,
  pendingTreeIds: pendingTreeIdsReducer,
  deleteTreeEvent: deleteTreeEventReducer,
});

export default appReducer;
