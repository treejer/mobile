import React, {useCallback, useMemo} from 'react';
import {Image} from 'react-native-image-crop-picker';
import {ImageBackground, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Trans, useTranslation} from 'react-i18next';

import Card from 'components/Card';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';

export type SelectTreePhotoProps = {
  testID?: string;
  treePhoto?: Image | File;
  onSelect: (photo?: Image | File) => void;
  disabled?: boolean;
};

export function SelectTreePhoto(props: SelectTreePhotoProps) {
  const {testID, disabled, treePhoto, onSelect} = props;

  const {t} = useTranslation();

  const handleOpenCamera = useCallback(() => {
    console.log('open camera button');
    onSelect();
  }, [onSelect]);

  const handleOpenGallery = useCallback(() => {
    console.log('open gallery button');
    onSelect();
  }, [onSelect]);

  const Wrapper = useMemo(() => (treePhoto ? ImageBackground : React.Fragment), [treePhoto]);
  const WrapperProps = useMemo(
    () =>
      treePhoto
        ? {
            testID: 'select-tree-photo-bg',
            imageStyle: styles.bgStyle,
            source: treePhoto,
          }
        : {},
    [treePhoto],
  );

  return (
    <Card testID={testID} style={styles.container}>
      {/*@ts-ignore*/}
      <Wrapper {...WrapperProps}>
        <View
          testID="select-tree-photo-content"
          style={[styles.contentContainer, {backgroundColor: treePhoto ? colors.darkOpacity : colors.khaki}]}
        >
          <View
            testID="select-tree-photo-text-container"
            style={[
              styles.textContainer,
              {backgroundColor: treePhoto ? colors.khakiOpacity : 'transparent'},
              treePhoto ? colors.boxInBoxShadow : {},
            ]}
          >
            <Text testID="photo-title" style={styles.title}>
              {t('submitTreeV2.photo')}
            </Text>
            <Spacer times={1} />
            <Text style={styles.desc}>
              <Trans
                testID="photo-description"
                i18nKey={treePhoto ? 'submitTreeV2.changePhoto' : 'submitTreeV2.selectPhoto'}
                components={{
                  Camera: <Text style={styles.bold} />,
                  Gallery: <Text style={styles.bold} />,
                }}
              />
            </Text>
          </View>
          <Spacer />
          <View>
            <TouchableOpacity
              testID="camera-button"
              style={[styles.button, {backgroundColor: treePhoto ? colors.grayDarkerOpacity : colors.grayDarker}]}
              disabled={disabled}
              onPress={handleOpenCamera}
            >
              <Icon testID="camera-button-icon" name="camera" color={colors.khaki} size={18} />
              <Spacer times={3} />
              <Text testID="camera-button-text" style={styles.btnText}>
                {t('submitTreeV2.camera')}
              </Text>
            </TouchableOpacity>
            <Spacer times={2} />
            <TouchableOpacity
              testID="gallery-button"
              style={[styles.button, {backgroundColor: treePhoto ? colors.grayDarkerOpacity : colors.grayDarker}]}
              disabled={disabled}
              onPress={handleOpenGallery}
            >
              <Icon testID="gallery-button-icon" name="photo-video" color={colors.khaki} size={18} />
              <Spacer times={3} />
              <Text testID="gallery-button-text" style={styles.btnText}>
                {t('submitTreeV2.gallery')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: colors.khaki,
    overflow: 'hidden',
    height: 104,
  },
  bgStyle: {
    borderRadius: 10,
    opacity: 0.5,
  },
  textContainer: {
    height: 74,
    minWidth: 178,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    color: colors.grayDarker,
    fontSize: 20,
    fontWeight: '500',
  },
  bold: {
    fontWeight: '600',
    fontSize: 12,
  },
  desc: {
    fontSize: 12,
    color: colors.grayDarker,
  },
  btnText: {
    color: colors.khaki,
  },
  button: {
    backgroundColor: colors.grayDarker,
    borderRadius: 50,
    width: 120,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
