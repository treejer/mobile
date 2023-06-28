import React, {useCallback, useMemo, useState} from 'react';
import {Image} from 'react-native-image-crop-picker';
import {ImageBackground, StyleSheet, View, Text, TouchableOpacity, Platform, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Trans, useTranslation} from 'react-i18next';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {RenderIf} from 'components/Common/RenderIf';
import WebCam from 'components/WebCam/WebCam';
import useCamera from 'utilities/hooks/useCamera';
import {isWeb} from 'utilities/helpers/web';
import {TPoint} from 'utilities/helpers/distanceInMeters';
import getCroppedImg from 'utilities/helpers/cropImage';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import WebImagePickerCropper from 'screens/TreeSubmission/screens/SelectPhoto/WebImagePickerCropper';
import {PickFromGalleryButton} from 'screens/TreeSubmissionV2/components/PickFromGalleryButton/PickFromGalleryButton';

export type TOnSelectTree = {
  photo: Image | File;
  fromGallery: boolean;
  photoLocation?: TPoint;
  imageBase64?: string;
};

export type SelectTreePhotoProps = {
  testID?: string;
  treePhoto?: Image | File;
  disabled?: boolean;
  onRemove?: () => void;
  onSelect: (args: TOnSelectTree) => void;
};

export function SelectTreePhoto(props: SelectTreePhotoProps) {
  const {testID, disabled, treePhoto, onRemove, onSelect} = props;

  const {openCameraHook, openLibraryHook} = useCamera();
  const [showCamera, setShowCamera] = useState(false);
  const [pickedPhoto, setPickedPhoto] = useState<File | null>(null);

  const {t} = useTranslation();

  const handleOpenCamera = useCallback(async () => {
    try {
      let selectedPhoto;
      let photoLocation;

      if (isWeb()) {
        setShowCamera(true);
        return;
      } else {
        selectedPhoto = await openCameraHook();
        if (selectedPhoto) {
          photoLocation = {
            latitude: selectedPhoto?.exif?.Latitude,
            longitude: selectedPhoto?.exif?.Longitude,
          };
          onSelect({photo: selectedPhoto, fromGallery: false, photoLocation});
        }
      }
    } catch (e) {
      console.log(e, 'error in open camera');
    }
  }, [onSelect, openCameraHook]);

  const handleTakePhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const selectedPhoto = await getCroppedImg(image, 'file.jpeg', croppedAreaPixels, rotation);
      setShowCamera(false);
      onSelect({photo: selectedPhoto, fromGallery: false, imageBase64: image});
    },
    [onSelect],
  );

  const handleOpenGallery = useCallback(
    async e => {
      try {
        console.log('open gallery button');

        let selectedPhoto;
        let photoLocation;

        if (isWeb()) {
          setPickedPhoto(e.target.files[0]);
          return;
        } else {
          selectedPhoto = await openLibraryHook();
          if (selectedPhoto) {
            photoLocation = {
              latitude: selectedPhoto?.exif?.Latitude,
              longitude: selectedPhoto?.exif?.Longitude,
            };
            onSelect({photo: selectedPhoto, fromGallery: true, photoLocation});
          }
        }
      } catch (e) {
        console.log(e, 'error i pick from gallery');
      }
    },
    [onSelect, openLibraryHook],
  );

  const handleSelectPhotoFromLibraryWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const selectedPhoto = await getCroppedImg(image, pickedPhoto?.name, croppedAreaPixels, rotation);
      setPickedPhoto(null);
      onSelect({photo: selectedPhoto, fromGallery: true, imageBase64: image});
    },
    [onSelect],
  );

  const Wrapper = useMemo(() => (treePhoto ? ImageBackground : React.Fragment), [treePhoto]);
  const WrapperProps = useMemo(
    () =>
      treePhoto
        ? {
            testID: 'select-tree-photo-bg',
            // @ts-ignore
            source: isWeb()
              ? URL.createObjectURL(treePhoto as Blob)
              : treePhoto?.hasOwnProperty('path')
              ? // @ts-ignore
                {uri: treePhoto?.path}
              : treePhoto,
            imageStyle: styles.bgStyle,
          }
        : {},
    [treePhoto],
  );

  return (
    <>
      <Modal visible={isWeb() && showCamera}>
        <WebCam testID="web-cam-cpt" handleDone={handleTakePhotoWeb} handleDismiss={() => setShowCamera(false)} />
      </Modal>
      <Modal visible={isWeb() && !!pickedPhoto} transparent style={{flex: 1}}>
        <WebImagePickerCropper
          testID="web-image-picker-cropper-cpt"
          imageData={pickedPhoto as File}
          handleDone={handleSelectPhotoFromLibraryWeb}
          handleDismiss={() => setPickedPhoto(null)}
        />
      </Modal>
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
              <View style={[styles.flexRow, globalStyles.justifyContentBetween]}>
                <View style={styles.flexRow}>
                  <RenderIf condition={!!treePhoto}>
                    <Icon testID="check-icon" name="check-circle" color={colors.green} size={20} />
                    <Spacer />
                  </RenderIf>
                  <Text testID="photo-title" style={styles.title}>
                    {t('submitTreeV2.photo')}
                  </Text>
                </View>
                <RenderIf condition={!!(treePhoto && onRemove && !disabled)}>
                  <TouchableOpacity
                    testID="remove-photo-button"
                    disabled={disabled}
                    activeOpacity={disabled ? 1 : undefined}
                    onPress={onRemove}
                  >
                    <Text testID="remove-photo-text" style={styles.removeText}>
                      {t('submitTreeV2.remove')}
                    </Text>
                  </TouchableOpacity>
                </RenderIf>
              </View>
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
              <PickFromGalleryButton hasTreePhoto={!!treePhoto} disabled={disabled} onPress={handleOpenGallery} />
            </View>
          </View>
        </Wrapper>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
    borderRadius: 10,
    height: 104,
    backgroundColor: colors.khaki,
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
    borderRadius: 10,
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
  removeText: {
    color: colors.red,
    fontWeight: '600',
    textDecorationColor: colors.red,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 12,
  },
  flexRow: {
    flexDirection: 'row',
    ...globalStyles.alignItemsCenter,
  },
});
