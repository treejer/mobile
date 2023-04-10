import exifr from 'exifr';

import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {maxDistanceInKiloMeters} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';
import {allCoordsIsExist} from 'utilities/helpers/checkTreePhoto/checkTreePhoto';

export type CheckTreePhotoArgs = {
  userLocation: TUserLocation;
  checkMetaData: boolean;
  imageCoords: TPoint;
  options?: {
    fromGallery?: boolean;
    browserPlatform?: BrowserPlatform;
    imageBase64?: string;
  };
};

export async function checkTreePhoto({checkMetaData, userLocation, options}: CheckTreePhotoArgs) {
  return new Promise(async (resolve, reject) => {
    const {fromGallery, browserPlatform, imageBase64} = options || {};
    try {
      if (browserPlatform === BrowserPlatform.iOS || !checkMetaData) {
        return resolve({latitude: 0, longitude: 0});
      } else {
        const {latitude, longitude} = await exifr.parse(imageBase64 || '');
        if (allCoordsIsExist({imageCoords: {latitude, longitude}, userLocation})) {
          const distanceInKiloMeters = calcDistanceInMeters({latitude, longitude}, userLocation) / 1000;
          if (distanceInKiloMeters < maxDistanceInKiloMeters) {
            return resolve({latitude, longitude});
          } else {
            reject({
              title: 'inValidImage.title',
              message: 'inValidImage.longDistance',
              mode: AlertMode.Error,
            });
          }
        } else {
          reject({
            title: 'inValidImage.title',
            mode: AlertMode.Error,
            message: fromGallery ? 'inValidImage.message' : 'inValidImage.hasNoLocation',
          });
        }
      }
    } catch (e) {
      reject({
        title: 'inValidImage.title',
        mode: AlertMode.Error,
        message: fromGallery ? 'inValidImage.message' : 'inValidImage.hasNoLocation',
      });
    }
  });
}
