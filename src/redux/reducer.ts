import {combineReducers} from 'redux';

import {initReducer} from './modules/init/init';
import {paginationReducer} from './modules/pagination/pagination.reducer';
import {web3Reducer} from './modules/web3/web3';
import {netInfoReducer} from './modules/netInfo/netInfo';
import {settingsReducer} from './modules/settings/settings';
import {contractsReducer} from './modules/contracts/contracts';
import {profileReducer} from './modules/profile/profile';
import {userSignReducer} from './modules/userSign/userSign';
import {userNonceReducer} from './modules/userNonce/userNonce';
import {countriesReducer} from './modules/countris/countries';
import {offlineMap} from './modules/offlineMap/offlineMap';
import {recentPlacesReducer} from './modules/recentPlaces/recentPlaces';
import {searchPlacesReducer} from './modules/searchPlaces/searchPlaces';
import {currentJourneyReducer} from './modules/currentJourney/currentJourney.reducer';
import {browserPlatformReducer} from './modules/browserPlatform/browserPlatform.reducer';
import {draftedJourneysReducer} from './modules/draftedJourneys/draftedJourneys.reducer';
import {mobileSendCodeReducer} from './modules/verification/mobileSendCode';
import {mobileResendCodeReducer} from './modules/verification/mobileResendCode';
import {verifyMobileReducer} from './modules/verification/verifyMoblie';
import {verifyProfileReducer} from './modules/verification/verifyProfile';
import {plantTreeReducer} from './modules/submitTreeEvents/plantTree';
import {assignedTreeReducer} from './modules/submitTreeEvents/assignedTree';
import {updateTreeReducer} from './modules/submitTreeEvents/updateTree';
import {treeDetailReducer} from './modules/trees/treeDetails';
import {deleteTreeEventReducer} from './modules/submitTreeEvents/deleteTreeEvent';
import {plantedTreesReducer} from './modules/trees/plantedTrees';
import {updatedTreesReducer} from './modules/trees/updatedTrees';
import {assignedTreesReducer} from './modules/trees/assignedTrees';

const appReducer = combineReducers({
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
  countries: countriesReducer,
  searchPlaces: searchPlacesReducer,
  currentJourney: currentJourneyReducer,
  browserPlatform: browserPlatformReducer,
  draftedJourneys: draftedJourneysReducer,
  offlineMap,
  mobileSendCode: mobileSendCodeReducer,
  mobileResendCode: mobileResendCodeReducer,
  verifyMobile: verifyMobileReducer,
  verifyProfile: verifyProfileReducer,
  plantTree: plantTreeReducer,
  assignedTree: assignedTreeReducer,
  updateTree: updateTreeReducer,
  treeDetails: treeDetailReducer,
  plantedTrees: plantedTreesReducer,
  updatedTrees: updatedTreesReducer,
  assignedTrees: assignedTreesReducer,
  deleteTreeEvent: deleteTreeEventReducer,
});

export default appReducer;
