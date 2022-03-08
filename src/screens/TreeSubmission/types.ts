import {Image} from 'react-native-image-crop-picker';
import {Tree} from 'types';

export interface TreeJourney {
  treeIdToUpdate?: string;
  photo?: Image;
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
}
