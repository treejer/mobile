import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {maxDistanceInKiloMeters} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';
import {allCoordsAreExist} from 'utilities/helpers/allCoordsAreExist';
import {JourneyMetadata} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

export type CheckTreePhotoArgs = {
  checkMetaData: boolean;
  userLocation?: TPoint;
  imageCoords?: TPoint;
  options?: {
    inCheck?: boolean;
    fromGallery?: boolean;
    browserPlatform?: BrowserPlatform | null;
    imageBase64?: string;
  };
};

export async function checkTreePhoto({checkMetaData, imageCoords, userLocation, options}: CheckTreePhotoArgs) {
  return new Promise((resolve, reject) => {
    const {fromGallery, inCheck} = options || {};
    if (!checkMetaData) {
      return resolve({latitude: 0, longitude: 0});
    }
    if (imageCoords && userLocation && allCoordsAreExist({imageCoords, userLocation})) {
      const distanceInKiloMeters = calcDistanceInMeters(imageCoords, userLocation) / 1000;
      if (distanceInKiloMeters < maxDistanceInKiloMeters) {
        resolve(imageCoords);
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
  });
}
