import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {maxDistanceInKiloMeters} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';

export type CheckTreePhotoArgs = {
  userLocation: TUserLocation;
  checkMetaData: boolean;
  imageCoords: TPoint;
  options?: {
    fromGallery?: boolean;
    browserPlatform?: BrowserPlatform | null;
    imageBase64?: string;
  };
};

export async function checkTreePhoto({checkMetaData, imageCoords, userLocation, options}: CheckTreePhotoArgs) {
  return new Promise((resolve, reject) => {
    const {fromGallery} = options || {};
    if (!checkMetaData) {
      return resolve({latitude: 0, longitude: 0});
    } else {
      if (allCoordsIsExist({imageCoords, userLocation})) {
        const distanceInKiloMeters = calcDistanceInMeters(imageCoords, userLocation) / 1000;
        if (distanceInKiloMeters < maxDistanceInKiloMeters) {
          return resolve(imageCoords);
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
  });
}

export function allCoordsIsExist({
  imageCoords,
  userLocation,
}: Pick<CheckTreePhotoArgs, 'userLocation' | 'imageCoords'>) {
  return imageCoords.latitude && imageCoords.longitude && userLocation.latitude && userLocation.longitude;
}
