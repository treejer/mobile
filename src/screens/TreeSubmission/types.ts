import {ImageInfo} from 'expo-image-picker/build/ImagePicker.types';

export interface TreeJourney {
  photo?: ImageInfo;
  location?: {
    latitude: number;
    longitude: number;
  };
}
