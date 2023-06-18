import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';

export type PickFromGalleryButtonProps = {
  disabled?: boolean;
  hasTreePhoto: boolean;
  onPress?: (e: any) => void;
};
export function PickFromGalleryButton(props: PickFromGalleryButtonProps) {
  const {hasTreePhoto, disabled, onPress} = props;

  const {t} = useTranslation();

  return (
    <label
      style={{
        backgroundColor: hasTreePhoto ? colors.grayDarkerOpacity : colors.grayDarker,
        borderRadius: 50,
        width: 120,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      htmlFor="inputFileV2"
    >
      <Icon testID="gallery-button-icon" name="photo-video" color={colors.khaki} size={18} />
      <Spacer times={3} />
      <Text testID="gallery-button-text" style={styles.btnText}>
        {t('submitTreeV2.gallery')}
      </Text>
      <input
        style={{display: 'none'}}
        disabled={disabled}
        type="file"
        id="inputFileV2"
        accept="image/png, image/jpeg"
        onChange={onPress}
      />
    </label>
  );
}

const styles = StyleSheet.create({
  btnText: {
    color: colors.khaki,
  },
});
