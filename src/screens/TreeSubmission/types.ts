import {TPoint} from 'utilities/helpers/distanceInMeters';
import {Image} from 'react-native-image-crop-picker';
import {Tree} from 'types';

export interface TreeJourney {
  treeIdToUpdate?: string | null;
  photo?: Image | File;
  photoLocation?: TPoint | null;
  location?: {
    latitude: number;
    longitude: number;
  };
  treeIdToPlant?: string;
  offlineId?: string;
  tree?: Tree;
  isSingle?: boolean | null;
  nurseryCount?: number;
  nurseryContinuedUpdatingLocation?: boolean;
  plantingModel?: string;
}
