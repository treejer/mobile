import {ImageInfo} from 'expo-image-picker/build/ImagePicker.types';

export interface TreeJourney {
  treeIdToUpdate?: string;
  photo?: ImageInfo;
  location?: {
    latitude: number;
    longitude: number;
  };
}
