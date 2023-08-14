import {TPoint} from 'utilities/helpers/distanceInMeters';

export type AllCoordsIsExistArgs = {
  imageCoords?: TPoint | null;
  userLocation?: TPoint | null;
};

export function allCoordsAreExist({imageCoords, userLocation}: AllCoordsIsExistArgs) {
  return !!(imageCoords?.latitude && imageCoords?.longitude && userLocation?.latitude && userLocation?.longitude);
}
