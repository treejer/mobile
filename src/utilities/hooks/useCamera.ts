import {useCallback} from 'react';
import {Linking, Alert} from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import {useTranslation} from 'react-i18next';

const useCamera = () => {
  const {t} = useTranslation();

  const openLibrary = useCallback(async () => {
    try {
      // const photo = await ImagePicker.launchImageLibraryAsync({
      //   exif: true,
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   quality: 0.8,
      //   allowsEditing: true,
      // });
      //
      // console.log(photo, 'a<====');
      // return photo;
    } catch (error) {
      console.log(error, '====> do something cancelled <====');
    }
  }, []);

  const openCamera = useCallback(async () => {
    try {
      // const photo = await ImagePicker.launchCameraAsync({
      //   exif: true,
      //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
      //   quality: 0.8,
      //   allowsEditing: true,
      // });
      // console.log(photo, 'photo');
      // return photo;
    } catch (error) {
      console.log(error, '====> do something cancelled <====');
    }
  }, []);

  const openSetting = () => {
    Alert.alert(t('permission.required'), t('permission.camera'), [
      {
        text: t('cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: t('ok'), onPress: () => Linking.openSettings()},
    ]);
  };

  const openCameraHook = async () => {
    // const {granted: grantedCamera} = await ImagePicker.requestCameraPermissionsAsync();
    // if (grantedCamera) {
    //   return openCamera();
    // } else {
    //   await openSetting();
    // }
  };

  // todo remove on production version
  const openLibraryHook = async () => {
    // const {granted: grantedCameraRoll} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (grantedCameraRoll) {
    //   return openLibrary();
    // } else {
    //   await openSetting();
    // }
  };

  const requestCameraPermission = async () => {
    // const {granted: grantedCameraRoll} = await ImagePicker.requestCameraPermissionsAsync();
    // if (!grantedCameraRoll) {
    //   await openSetting();
    // }
  };

  return {openCameraHook, openLibraryHook, requestCameraPermission};
};

export default useCamera;
