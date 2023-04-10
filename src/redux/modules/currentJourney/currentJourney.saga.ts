import {put, select, takeEvery} from 'redux-saga/effects';
import i18next from 'i18next';

import {TReduxState} from 'ranger-redux/store';
import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {BrowserPlatformState} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import {TSettings} from 'ranger-redux/modules/settings/settings';
import {checkTreePhoto} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';
import {TPoint} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {canUpdateTreeLocation} from 'utilities/helpers/submitTree';
import * as actionsList from './currentJourney.action';
import {showSagaAlert} from 'utilities/helpers/alert';

export const getSettings = (state: TReduxState) => state.settings;
export const getBrowserPlatform = (state: TReduxState) => state.browserPlatform;
export const getCurrentJourney = (state: TReduxState) => state.currentJourney;

export function* watchAssignJourneyTreePhoto({
  photo,
  photoLocation,
  userLocation,
  imageBase64,
  fromGallery,
}: actionsList.AssignJourneyTreePhotoAction & {type: string}) {
  try {
    const {checkMetaData}: TSettings = yield select(getSettings);
    const {platform}: BrowserPlatformState = yield select(getBrowserPlatform);
    const journey: TCurrentJourney = yield select(getCurrentJourney);

    const photoCoords = yield checkTreePhoto({
      imageCoords: photoLocation as TPoint,
      userLocation: userLocation as TUserLocation,
      checkMetaData,
      options: {
        imageBase64,
        browserPlatform: platform,
        fromGallery,
      },
    });

    const discardUpdateLocation = journey.isUpdate && canUpdateTreeLocation(journey, !!journey?.isNursery);
    yield put(actionsList.setTreePhoto({photo, photoLocation: photoCoords, discardUpdateLocation}));
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
}
