import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
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
  const {disabled, hasTreePhoto, onPress} = props;

  const {t} = useTranslation();

  return (
    <TouchableOpacity
      testID="gallery-button"
      style={[styles.button, {backgroundColor: hasTreePhoto ? colors.grayDarkerOpacity : colors.grayDarker}]}
      disabled={disabled}
      onPress={onPress}
    >
      <Icon testID="gallery-button-icon" name="photo-video" color={colors.khaki} size={18} />
      <Spacer times={3} />
      <Text testID="gallery-button-text" style={styles.btnText}>
        {t('submitTreeV2.gallery')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.grayDarker,
    borderRadius: 50,
    width: 120,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: colors.khaki,
  },
});
