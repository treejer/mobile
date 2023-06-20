import React, {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles, {space} from 'constants/styles';
import {mapboxPrivateToken} from 'services/config';
import {isWeb} from 'utilities/helpers/web';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {NotVerifiedTreeImage} from 'components/TreeListV2/NotVerifiedTreeImage';
import {TreePhotos} from 'screens/GreenBlock/screens/TreeDetails/TreePhotos';
import {useProfile} from 'ranger-redux/modules/profile/profile';
import {useTreeDetails} from 'ranger-redux/modules/trees/treeDetails';
import {TCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {Hex2Dec} from 'utilities/helpers/hex';

const {width} = Dimensions.get('window');

export type PreviewTreeDetailsProps = {
  testID?: string;
  isVisible: boolean;
  currentJourney: TCurrentJourney;
  onClose: () => void;
  onSubmit: () => void;
  onDraft: () => void;
};

export function PreviewTreeDetails(props: PreviewTreeDetailsProps) {
  const {testID, isVisible, currentJourney, onClose, onSubmit, onDraft} = props;

  const {profile} = useProfile();
  const {treeDetails, dispatchGetTreeDetails, loading: treeDetailsLoading, dispatchClearTreeDetails} = useTreeDetails();

  const {t} = useTranslation();

  useEffect(() => {
    if (isVisible) {
      if (currentJourney.treeIdToUpdate) {
        dispatchGetTreeDetails(currentJourney.treeIdToUpdate);
      }
      if (currentJourney.treeIdToPlant) {
        dispatchGetTreeDetails(currentJourney.treeIdToPlant);
      }
    }

    return () => {
      dispatchClearTreeDetails();
    };
  }, [isVisible]);

  const treeSpecs = useMemo(() => treeDetails?.treeSpecsEntity, [treeDetails?.treeSpecsEntity]);

  const updates = useMemo(
    () =>
      typeof treeSpecs?.updates != 'undefined' && treeSpecs?.updates != '' && treeSpecs?.updates != null
        ? [...JSON.parse(treeSpecs?.updates), {preview: currentJourney.photo}]
        : [{preview: currentJourney.photo}],
    [treeSpecs?.updates, currentJourney.photo, currentJourney.isUpdate, currentJourney.treeIdToPlant],
  );

  const updatesCount = useMemo(() => updates?.length, [updates?.length]);

  const staticMapUrl = useMemo(
    () =>
      getStaticMapboxUrl(
        mapboxPrivateToken,
        currentJourney?.location?.longitude,
        currentJourney?.location?.latitude,
        600,
        300,
      ),
    [currentJourney?.location?.longitude, currentJourney?.location?.latitude],
  );

  const cardWidth = useMemo(() => {
    if (isWeb()) {
      return width - space[2] - space[3];
    } else {
      return width - globalStyles.p2.padding - globalStyles.p3.padding;
    }
  }, []);

  return (
    <Modal
      testID={testID}
      isVisible={isVisible}
      swipeDirection="down"
      customBackdrop={
        <TouchableWithoutFeedback style={{flex: 1}} onPress={onClose}>
          <View style={{flex: 1, backgroundColor: colors.modalBg}} />
        </TouchableWithoutFeedback>
      }
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onSwipeComplete={onClose}
      swipeThreshold={150}
      propagateSwipe
      style={{marginBottom: 0, marginHorizontal: 0, marginTop: 8 * 12}}
    >
      <View
        testID="modal-gesture"
        style={[
          globalStyles.screenView,
          globalStyles.fill,
          {borderRadius: 20, width: '100%', maxWidth: 767, margin: 'auto'},
        ]}
      >
        <View style={[globalStyles.justifyContentCenter, globalStyles.alignItemsCenter, {paddingVertical: 4}]}>
          <View style={{width: 48, height: 8, backgroundColor: colors.green, borderRadius: 20}} />
        </View>
        {treeDetailsLoading ? (
          <View style={[globalStyles.fill, globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}>
            <ActivityIndicator testID="loading" color={colors.green} size="large" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[globalStyles.screenView, globalStyles.fill, globalStyles.p2]}
          >
            <TouchableOpacity onPress={() => {}} activeOpacity={1} style={[globalStyles.fill, globalStyles.safeArea]}>
              <View style={globalStyles.alignItemsCenter}>
                <NotVerifiedTreeImage
                  testID="tree-image-cpt"
                  tree={
                    {
                      treeSpecs: JSON.stringify({
                        nursery: currentJourney.isNursery,
                        image: treeDetails?.treeSpecsEntity?.imageFs,
                      }),
                    } as any
                  }
                  size={120}
                />
              </View>
              <Text testID="tree-name" style={[globalStyles.h3, globalStyles.textCenter]}>
                {profile?.plantingNonce}
              </Text>
              <Spacer times={8} />

              <View>
                <Card>
                  <Text testID="tree-coords-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                    {t('previewTreeDetails.gpsCoords')}
                  </Text>
                  <Text testID="tree-coords" style={[globalStyles.h5, globalStyles.textCenter]}>
                    {t('previewTreeDetails.coords', {
                      lat: currentJourney?.location?.latitude.toFixed(7),
                      long: currentJourney?.location?.longitude.toFixed(7),
                    })}
                  </Text>
                  <Spacer times={6} />

                  <Text
                    testID="tree-submittedAt-date-label"
                    style={[globalStyles.h6, globalStyles.textCenter, styles.header]}
                  >
                    {t('previewTreeDetails.submitDate')}
                  </Text>
                  <Text testID="tree-submittedAt-date" style={[globalStyles.h5, globalStyles.textCenter]}>
                    {new Date().toLocaleDateString()}
                  </Text>
                  <Spacer times={6} />

                  {treeDetails ? (
                    <>
                      <Text testID="tree-id-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                        {t('previewTreeDetails.treeId')}
                      </Text>
                      <Text testID="tree-id" style={[globalStyles.h5, globalStyles.textCenter]}>
                        #{Hex2Dec(treeDetails.id)}
                      </Text>
                      <Spacer times={6} />
                    </>
                  ) : null}

                  <TouchableOpacity
                    testID="tree-location-btn"
                    style={{
                      marginHorizontal: -20,
                      marginBottom: -23,
                    }}
                    onPress={() => {
                      const uri = `https://maps.google.com/?q=${
                        Number(currentJourney?.location?.latitude) / Math.pow(10, 6)
                      },${Number(currentJourney?.location?.longitude) / Math.pow(10, 6)}`;
                      Linking.openURL(uri);
                    }}
                  >
                    <Image
                      testID="tree-location-image"
                      resizeMode="cover"
                      style={{
                        alignSelf: 'center',
                        width: '99%',
                        height: 200,
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
                      }}
                      source={{
                        uri: staticMapUrl,
                      }}
                    />
                  </TouchableOpacity>
                </Card>
                <Spacer times={8} />

                {Boolean(cardWidth) && updates && updatesCount > 0 && (
                  <View>
                    <View
                      style={[
                        globalStyles.horizontalStack,
                        globalStyles.alignItemsCenter,
                        styles.titleContainer,
                        {width: cardWidth},
                      ]}
                    >
                      <View style={styles.titleLine} />
                      <Text style={[globalStyles.ph1, globalStyles.h5]}>
                        {t(`previewTreeDetails.${updatesCount > 1 ? 'photos' : 'photo'}`)}
                      </Text>
                      <View style={styles.titleLine} />
                    </View>
                    <Spacer times={8} />
                    <TreePhotos
                      testID="tree-photos-slider"
                      updatesCount={updatesCount}
                      cardWidth={cardWidth}
                      updates={updates}
                    />
                  </View>
                )}
                <Spacer times={4} />
                <TouchableOpacity testID="submit-btn" style={[styles.btn, styles.submitBtn]} onPress={onSubmit}>
                  <Text testID="submit-btn-text" style={styles.whiteText}>
                    {t('previewTreeDetails.submit')}
                  </Text>
                </TouchableOpacity>
                <Spacer times={2} />
                <TouchableOpacity testID="draft-btn" style={[styles.btn, styles.draftBtn]} onPress={onDraft}>
                  <Text testID="draft-btn-text" style={styles.blackText}>
                    {t('previewTreeDetails.draft')}
                  </Text>
                </TouchableOpacity>
                <Spacer times={2} />
                <TouchableOpacity testID="reject-btn" style={[styles.btn, styles.rejectBtn]} onPress={onClose}>
                  <Text testID="reject-btn-text" style={styles.whiteText}>
                    {t('previewTreeDetails.reject')}
                  </Text>
                </TouchableOpacity>
                <Spacer times={12} />
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#757575',
  },
  titleLine: {
    height: 2,
    backgroundColor: colors.grayLight,
    flex: 1,
  },
  titleContainer: {
    alignSelf: 'center',
  },
  btn: {
    ...colors.smShadow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  submitBtn: {
    backgroundColor: colors.green,
  },
  draftBtn: {
    backgroundColor: colors.yellow,
  },
  rejectBtn: {
    backgroundColor: colors.red,
  },
  blackText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  whiteText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
});
