import React, {useCallback, useMemo} from 'react';
import {Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {GreenBlockRouteParamList, TreeStatus} from 'types';
import {mapboxPrivateToken} from 'services/config';
import {colors} from 'constants/values';
import globalStyles, {space} from 'constants/styles';
import {Routes} from 'navigation/Navigation';
import Card from 'components/Card';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {NotVerifiedTreeImage} from 'components/TreeListV2/NotVerifiedTreeImage';
import {TreePhotos} from 'screens/GreenBlock/screens/TreeDetails/TreePhotos';
import {isWeb} from 'utilities/helpers/web';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {useDeleteTreeEvent} from 'ranger-redux/modules/submitTreeEvents/deleteTreeEvent';

const {width} = Dimensions.get('window');

export function NotVerifiedTreeDetails() {
  const {
    params: {tree},
  } = useRoute<RouteProp<GreenBlockRouteParamList, Routes.NotVerifiedTreeDetails>>();

  const {
    loading: deleteTreeEventLoading,
    dispatchDeleteUpdateEvent,
    dispatchDeleteAssignedEvent,
    dispatchDeletePlantEvent,
  } = useDeleteTreeEvent();

  const navigation = useNavigation();

  const {t} = useTranslation();

  const handleDeleteTreeEvent = useCallback(() => {
    if (tree.treeId && tree.birthDate && tree.countryCode !== undefined) {
      dispatchDeleteAssignedEvent(tree?._id);
    } else if (tree.treeId) {
      dispatchDeleteUpdateEvent(tree?._id);
    } else {
      dispatchDeletePlantEvent(tree?._id);
    }
  }, [
    tree.treeId,
    tree.birthDate,
    tree.countryCode,
    navigation,
    dispatchDeleteAssignedEvent,
    dispatchDeleteUpdateEvent,
    dispatchDeletePlantEvent,
  ]);

  const treeSpecs = useMemo(() => JSON.parse(tree.treeSpecs), [tree.treeSpecs]);

  const staticMapUrl = useMemo(
    () =>
      getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(treeSpecs?.location?.longitude) / Math.pow(10, 6),
        Number(treeSpecs?.location?.latitude) / Math.pow(10, 6),
        600,
        300,
      ),
    [treeSpecs?.location?.longitude, treeSpecs?.location?.latitude],
  );

  const cardWidth = useMemo(() => {
    if (isWeb()) {
      return width - space[2] - space[3];
    } else {
      return width - globalStyles.p2.padding - globalStyles.p3.padding;
    }
  }, []);

  const updates = useMemo(
    () =>
      typeof treeSpecs?.updates != 'undefined' && treeSpecs?.updates != '' && treeSpecs?.updates != null
        ? treeSpecs?.updates
        : [],
    [treeSpecs?.updates],
  );

  const updatesCount = useMemo(() => treeSpecs?.updates?.length, [treeSpecs?.updates?.length]);

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle
        testID="screen-title-cpt"
        title={tree?.status === TreeStatus.REJECTED ? t('notVerifiedTreeDetails.rejected') : undefined}
        textStyle={{color: colors.red}}
        goBack
        rightContent={<Avatar size={40} type="active" />}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
          <View style={globalStyles.alignItemsCenter}>
            <NotVerifiedTreeImage testID="tree-image-cpt" tree={tree} size={120} />
          </View>
          <Text testID="tree-name" style={[globalStyles.h3, globalStyles.textCenter]}>
            {tree.nonce}
          </Text>
          <Spacer times={8} />

          <View style={globalStyles.p2}>
            <Card>
              <View style={styles.deleteButtonContainer}>
                <Button
                  testID="tree-delete-btn"
                  variant="success"
                  caption={t('notVerifiedTreeDetails.delete')}
                  textStyle={globalStyles.textCenter}
                  onPress={handleDeleteTreeEvent}
                  style={styles.deleteButton}
                  disabled={deleteTreeEventLoading}
                  loading={deleteTreeEventLoading}
                />
              </View>
              <Spacer times={4} />

              <Text testID="tree-coords-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                {t('notVerifiedTreeDetails.gpsCoords')}
              </Text>
              <Text testID="tree-coords" style={[globalStyles.h5, globalStyles.textCenter]}>
                {t('notVerifiedTreeDetails.coords', {
                  lat: Number(treeSpecs.location.latitude) / Math.pow(10, 6),
                  long: Number(treeSpecs.location.longitude) / Math.pow(10, 6),
                })}
              </Text>
              <Spacer times={6} />

              <Text
                testID="tree-createdAt-date-label"
                style={[globalStyles.h6, globalStyles.textCenter, styles.header]}
              >
                {t('notVerifiedTreeDetails.createdAt')}
              </Text>
              <Text testID="tree-createdAt-date" style={[globalStyles.h5, globalStyles.textCenter]}>
                {new Date(tree?.createdAt).toLocaleDateString()}
              </Text>
              <Spacer times={6} />

              {tree?.treeId ? (
                <>
                  <Text testID="tree-id-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                    {t('notVerifiedTreeDetails.treeId')}
                  </Text>
                  <Text testID="tree-id" style={[globalStyles.h5, globalStyles.textCenter]}>
                    #{tree.treeId}
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
                  const uri = `https://maps.google.com/?q=${Number(treeSpecs.location.latitude) / Math.pow(10, 6)},${
                    Number(treeSpecs.location.longitude) / Math.pow(10, 6)
                  }`;
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
                    {t(`notVerifiedTreeDetails.${updatesCount > 1 ? 'photos' : 'photo'}`)}
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
            <Spacer times={8} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#757575',
  },
  deleteButtonContainer: {
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: -40,
  },
  deleteButton: {
    backgroundColor: colors.red,
  },
  titleLine: {
    height: 2,
    backgroundColor: colors.grayLight,
    flex: 1,
  },
  titleContainer: {
    alignSelf: 'center',
  },
});
