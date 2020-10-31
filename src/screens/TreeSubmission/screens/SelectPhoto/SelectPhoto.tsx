import {useNavigation} from '@react-navigation/native';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import * as ImagePicker from 'expo-image-picker';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

interface Props {}

function SelectPhoto(props: Props) {
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const status = await ImagePicker.getCameraPermissionsAsync();
      if (status.granted) {
        const result = await ImagePicker.launchCameraAsync({
          exif: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        navigation.navigate('SelectOnMap', {photo: result});
      }
    })();
  }, [navigation]);

  return <View style={globalStyles.fill}></View>;
}

export default SelectPhoto;
