import {put, select, takeEvery} from 'redux-saga/effects';
import i18next from 'i18next';

import {TReduxState} from 'ranger-redux/store';
import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {BrowserPlatformState} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import {TSettings} from 'ranger-redux/modules/settings/settings';
import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';
import {showSagaAlert} from 'utilities/helpers/alert';
import {checkTreeLocation} from 'utilities/helpers/checkTreeLocation/checkTreeLocation';
import {navigationRef} from 'navigation/navigationRef';
import {Routes} from 'navigation/Navigation';
import * as actionsList from './currentJourney.action';

export const getSettings = (state: TReduxState) => state.settings;
export const getBrowserPlatform = (state: TReduxState) => state.browserPlatform;
export const getCurrentJourney = (state: TReduxState) => state.currentJourney;

export type AssignJourneyTreePhotoAction = {
  type: string;
} & actionsList.AssignJourneyTreePhotoPayload;

export function* watchAssignJourneyTreePhoto({
  photo,
  photoLocation,
  userLocation,
  imageBase64,
  fromGallery,
}: AssignJourneyTreePhotoAction) {
  try {
    const {checkMetaData}: TSettings = yield select(getSettings);
    const {platform}: BrowserPlatformState = yield select(getBrowserPlatform);
    const journey: TCurrentJourney = yield select(getCurrentJourney);

    const photoCoords = yield checkTreePhoto({
      imageCoords: photoLocation,
      userLocation: userLocation,
      checkMetaData,
      options: {
        imageBase64,
        browserPlatform: platform,
        fromGallery,
      },
    });

    if (journey.location) {
      yield checkTreeLocation({
        photoLocation,
        submittedLocation: journey.location,
        checkMetaData,
        browserPlatform: platform,
        isUpdate: journey.isUpdate,
      });
    }

    yield put(actionsList.setTreePhoto({photo, photoLocation: photoCoords}));
  } catch (e: any) {
    yield showSagaAlert({
      title: i18next.t(e?.title),
      mode: e?.mode,
      message: i18next.t(e?.message),
    });
  }
}

export type AssignJourneyTreeLocationAction = {
  type: string;
} & actionsList.AssignJourneyTreeLocationPayload;

export function* watchAssignJourneyTreeLocation({location}: AssignJourneyTreeLocationAction) {
  try {
    const {checkMetaData}: TSettings = yield select(getSettings);
    const {platform}: BrowserPlatformState = yield select(getBrowserPlatform);
    const {photo, photoLocation, isUpdate}: TCurrentJourney = yield select(getCurrentJourney);

    if (!photo && !photoLocation && location) {
      yield put(actionsList.setTreeLocation({coords: location}));
    } else {
      const coords = yield checkTreeLocation({
        checkMetaData,
        submittedLocation: location,
        photoLocation,
        isUpdate: !!isUpdate,
        browserPlatform: platform,
      });
      yield put(actionsList.setTreeLocation({coords}));
    }
    //@ts-ignore
    navigationRef()?.navigate(Routes.SubmitTree_V2);
  } catch (e: any) {
    yield showSagaAlert({
      title: i18next.t(e?.title),
      mode: e?.mode,
      message: i18next.t(e?.message),
    });
  }
}

export function* currentJourneySagas() {
  yield takeEvery(actionsList.ASSIGN_JOURNEY_TREE_PHOTO_WATCHER, watchAssignJourneyTreePhoto);
  yield takeEvery(actionsList.ASSIGN_JOURNEY_TREE_LOCATION_WATCHER, watchAssignJourneyTreeLocation);
}
