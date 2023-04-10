import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {maxDistanceInMeters} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';
import {allCoordsAreExist} from 'utilities/helpers/allCoordsAreExist';

export type CheckTreeLocationArgs = {
  isUpdate?: boolean;
  submittedLocation?: TPoint;
  photoLocation?: TPoint | null;
  browserPlatform: BrowserPlatform | null;
  checkMetaData: boolean;
};

export function checkTreeLocation({
  checkMetaData,
  browserPlatform,
  submittedLocation,
  photoLocation: imageCoords,
  isUpdate,
}: CheckTreeLocationArgs) {
  return new Promise((resolve, reject) => {
    const error = isUpdate ? 'updateSingleTree' : 'newTree';
    try {
      if (browserPlatform === BrowserPlatform.iOS || !checkMetaData) {
        return resolve(submittedLocation);
      }
      if (!submittedLocation || !imageCoords) {
        console.log('userLocation and imageCoords are not exist');
        throw Error('error');
      }
      const distance = calcDistanceInMeters(submittedLocation, imageCoords);
      if (allCoordsAreExist({imageCoords, userLocation: submittedLocation}) && distance < maxDistanceInMeters) {
        resolve(submittedLocation);
      } else {
        reject({
          title: `map.${error}.errTitle`,
          mode: AlertMode.Error,
          message: `map.${error}.errMessage`,
        });
      }
    } catch (e) {
      reject({
        title: `map.${error}.errTitle`,
        mode: AlertMode.Error,
        message: `map.${error}.errMessage`,
      });
    }
  });
}
