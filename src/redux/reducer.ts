import {combineReducers} from 'redux';

import {initReducer} from 'ranger-redux/modules/init/init';
import {web3Reducer} from 'ranger-redux/modules/web3/web3';
import {netInfoReducer} from 'ranger-redux/modules/netInfo/netInfo';
import {settingsReducer} from 'ranger-redux/modules/settings/settings';
import {contractsReducer} from 'ranger-redux/modules/contracts/contracts';
import {profileReducer} from 'ranger-redux/modules/profile/profile';
import {userSignReducer} from 'ranger-redux/modules/userSign/userSign';
import {userNonceReducer} from 'ranger-redux/modules/userNonce/userNonce';
import {countriesReducer} from 'ranger-redux/modules/countris/countries';
import {offlineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import {recentPlacesReducer} from 'ranger-redux/modules/recentPlaces/recentPlaces';
import {searchPlacesReducer} from 'ranger-redux/modules/searchPlaces/searchPlaces';
import {currentJourneyReducer} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {browserPlatformReducer} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import {draftedJourneysReducer} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {mobileSendCodeReducer} from 'ranger-redux/modules/verification/mobileSendCode';
import {mobileResendCodeReducer} from 'ranger-redux/modules/verification/mobileResendCode';
import {verifyMobileReducer} from 'ranger-redux/modules/verification/verifyMoblie';
import {verifyProfileReducer} from 'ranger-redux/modules/verification/verifyProfile';

const appReducer = combineReducers({
  init: initReducer,
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
});

export default appReducer;
