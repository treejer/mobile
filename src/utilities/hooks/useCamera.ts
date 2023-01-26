import {useCallback} from 'react';
import ImagePicker, {Image, Options} from 'react-native-image-crop-picker';

const useCamera = () => {
  const openLibrary = useCallback(async () => {
    try {
      const photo = await ImagePicker.openPicker({
        includeExif: true,
        mediaType: 'photo',
        compressImageQuality: 0.1,
        cropping: true,
      });

      return Promise.resolve(photo);
    } catch (error) {
      console.log(error, '====> do something cancelled <====');
    }
  }, []);

  const openCamera = useCallback(async (options?: Options): Promise<Image | void> => {
    try {
      const photo = await ImagePicker.openCamera({
        includeExif: true,
        mediaType: 'photo',
        compressImageQuality: 0.1,
        cropping: true,
        ...options,
      });
      return Promise.resolve(photo);
    } catch (error) {
      console.log(error, '====> do something cancelled <====');
    }
  }, []);

  return {openCameraHook: openCamera, openLibraryHook: openLibrary};
};

export default useCamera;
