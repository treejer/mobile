import exifr from 'exifr';

import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {maxDistanceInKiloMeters} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';
import {allCoordsAreExist} from 'utilities/helpers/allCoordsAreExist';
import {JourneyMetadata} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

export type CheckTreePhotoArgs = {
  userLocation: TPoint;
  checkMetaData: boolean;
  imageCoords: TPoint;
  options?: {
    inCheck?: boolean;
    fromGallery?: boolean;
    browserPlatform?: BrowserPlatform;
    imageBase64?: string;
  };
};

export async function checkTreePhoto({checkMetaData, userLocation, imageCoords, options}: CheckTreePhotoArgs) {
  return new Promise(async (resolve, reject) => {
    const {fromGallery, inCheck, browserPlatform, imageBase64} = options || {};
    try {
      if (browserPlatform === BrowserPlatform.iOS || !checkMetaData) {
        return resolve({latitude: 0, longitude: 0});
      } else {
        const {latitude, longitude} = shouldUseImageCoords(imageCoords)
          ? imageCoords
          : await exifr.parse(imageBase64 || '');
        if (allCoordsAreExist({imageCoords: {latitude, longitude}, userLocation})) {
          const distanceInKiloMeters = calcDistanceInMeters({latitude, longitude}, userLocation) / 1000;
          if (distanceInKiloMeters < maxDistanceInKiloMeters) {
            return resolve({latitude, longitude});
          } else {
            reject({
              data: inCheck && JourneyMetadata.Photo,
              title: 'inValidImage.title',
              message: 'inValidImage.longDistance',
              mode: AlertMode.Error,
            });
          }
        } else {
          reject({
            data: inCheck && JourneyMetadata.Photo,
            title: 'inValidImage.title',
            mode: AlertMode.Error,
            message: fromGallery ? 'inValidImage.message' : 'inValidImage.hasNoLocation',
          });
        }
      }
    } catch (e) {
      reject({
        data: inCheck && JourneyMetadata.Photo,
        title: 'inValidImage.title',
        mode: AlertMode.Error,
        message: fromGallery ? 'inValidImage.message' : 'inValidImage.hasNoLocation',
      });
    }
  });
}

export function shouldUseImageCoords(imageCoords: TPoint) {
  return imageCoords.latitude && imageCoords.longitude;
}
