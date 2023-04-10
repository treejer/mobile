import {Image} from 'react-native-image-crop-picker';

import {TPoint} from 'utilities/helpers/distanceInMeters';
import {Tree} from 'types';

export interface TreeJourney_V2 {
  treeIdToUpdate?: string | null;
  photo?: Image | File;
  photoLocation?: TPoint | null;
  location?: {
    latitude: number;
    longitude: number;
  };
  treeIdToPlant?: string;
  tree?: Tree;
  isSingle?: boolean | null;
  isNursery?: boolean;
  nurseryCount?: number;
  nurseryContinuedUpdatingLocation?: boolean;
  plantingModel?: string;
  isUpdate?: boolean;
  canUpdateLocation?: boolean;
}
