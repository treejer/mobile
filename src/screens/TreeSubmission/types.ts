// import {ImageInfo, OpenFileBrowserOptions} from 'expo-image-picker/build/ImagePicker.types';
import {Tree} from 'types';

export interface TreeJourney {
  treeIdToUpdate?: string;
  // photo?: ImageInfo | any;
  location?: {
    latitude: number;
    longitude: number;
  };
  treeIdToPlant?: string;
  offlineId?: string;
  tree?: Tree;
  isSingle?: boolean | null;
  nurseryCount?: number;
}
