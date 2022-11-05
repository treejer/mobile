import {useCallback} from 'react';
import ImagePicker, {Image, Options} from 'react-native-image-crop-picker';
import {useTranslation} from 'react-i18next';

const useCamera = () => {
  const {t} = useTranslation();

  const openLibrary = useCallback(async () => {
    try {
      const photo = await ImagePicker.openPicker({
        includeExif: true,
        mediaType: 'photo',
        compressImageQuality: 0.5,
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
        compressImageQuality: 0.5,
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
