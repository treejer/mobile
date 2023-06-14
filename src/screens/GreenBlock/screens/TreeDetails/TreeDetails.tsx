import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonActions, NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NetworkStatus, useQuery} from '@apollo/client';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import globalStyles, {space} from 'constants/styles';
import {colors} from 'constants/values';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import Spacer from 'components/Spacer';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Button from 'components/Button';
import {GreenBlockRouteParamList} from 'types';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {Hex2Dec} from 'utilities/helpers/hex';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {TreeImage} from 'components/TreeList/TreeImage';
import {diffUpdateTime, isUpdatePended, treeColor, treeDiffUpdateHumanized} from 'utilities/helpers/tree';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import {Routes} from 'navigation/index';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {TreePhotos} from 'screens/GreenBlock/screens/TreeDetails/TreePhotos';
import {isWeb} from 'utilities/helpers/web';
import {mapboxPrivateToken} from 'services/config';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {useCurrentJourney} from 'services/currentJourney';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {useCurrentJourney as useNewCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';

interface Props {}

const {width} = Dimensions.get('window');

function TreeDetails(_: Props) {
  const navigation = useNavigation<NavigationProp<GreenBlockRouteParamList>>();
  const {
    params: {tree},
  } = useRoute<RouteProp<GreenBlockRouteParamList, Routes.TreeDetails>>();
  const {releaseDate, changeCheckMetaData} = useSettings();
  const {isMainnet, useV1Submission} = useConfig();

  const {dispatchSetTreeDetailToUpdate, dispatchClearJourney} = useNewCurrentJourney();

  const {setNewJourney} = useCurrentJourney();

  const {sendEvent} = useAnalytics();

  const {t} = useTranslation();

  const {loading, data, networkStatus, refetch} = useQuery<TreeDetailQueryQueryData>(TreeDetailQuery, {
    variables: {
      id: tree?.id,
    },
  });

  const treeUpdateInterval = useTreeUpdateInterval();

  const treeDetails = useMemo(() => data?.tree || tree, [data?.tree, tree]);

  // console.log(new Date(Number(treeDetails?.birthDate) * 1000), '====> treeDetails?.birthDate <====');
  // console.log(treeDetails?.birthDate, '====> treeDetails?.birthDate <====');

  const staticMapUrl = useMemo(
    () =>
      getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(treeDetails?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
        Number(treeDetails?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
        600,
        300,
      ),
    [treeDetails?.treeSpecsEntity?.latitude, treeDetails?.treeSpecsEntity?.longitude],
  );

  const updates = useMemo(
    () =>
      typeof treeDetails?.treeSpecsEntity?.updates != 'undefined' &&
      treeDetails?.treeSpecsEntity?.updates != '' &&
      treeDetails?.treeSpecsEntity?.updates != null
        ? JSON.parse(treeDetails?.treeSpecsEntity?.updates)
        : [],
    [treeDetails?.treeSpecsEntity?.updates],
  );

  const updatesCount = updates?.length;

  const cardWidth = useMemo(() => {
    if (isWeb()) {
      return width - space[2] - space[3];
    } else {
      return width - globalStyles.p2.padding - globalStyles.p3.padding;
    }
  }, []);

  const handleUpdate = () => {
    if (!treeDetails) {
      showAlert({
        message: t('cannotUpdateTree'),
        mode: AlertMode.Error,
      });
      return;
    }
    if (isUpdatePended(treeDetails)) {
      showAlert({
        title: t('treeDetails.cannotUpdate.title'),
        message: t('treeDetails.cannotUpdate.details'),
        mode: AlertMode.Info,
      });
      return;
    }

    const diff = diffUpdateTime(treeDetails, treeUpdateInterval);

    if (diff < 0) {
      showAlert({
        title: t('treeDetails.cannotUpdate.details'),
        message: t('treeDetails.cannotUpdate.wait', {seconds: treeDiffUpdateHumanized(Math.abs(diff))}),
        mode: AlertMode.Warning,
      });
      return;
    }
    sendEvent('update_tree');
    if (isMainnet && releaseDate > Number(treeDetails?.plantDate)) {
      changeCheckMetaData(false);
    }
    dispatchClearJourney();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: useV1Submission ? Routes.TreeSubmission : Routes.TreeSubmission_V2,
            params: {
              initialRouteName: useV1Submission ? Routes.SelectPhoto : Routes.SubmitTree_V2,
            },
          },
        ],
      }),
    );
    if (useV1Submission) {
      setNewJourney({
        treeIdToUpdate: tree?.id,
        tree: treeDetails,
        location: {
          latitude: Number(treeDetails?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
          longitude: Number(treeDetails?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
        },
      });
    } else {
      if (tree?.id) {
        dispatchSetTreeDetailToUpdate({treeIdToUpdate: tree?.id, tree: treeDetails});
      }
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator testID="loading-indicator" color={colors.green} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle testID="screen-title-cpt" goBack rightContent={<Avatar size={40} type="active" />} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[globalStyles.screenView, globalStyles.fill]}
        refreshControl={
          isWeb() ? undefined : (
            <RefreshControl refreshing={networkStatus === NetworkStatus.refetch} onRefresh={() => refetch()} />
          )
        }
      >
        <PullToRefresh onRefresh={() => refetch()}>
          <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
            {treeDetails ? (
              <TreeImage
                testID="tree-image-cpt"
                color={colors.green}
                tree={treeDetails}
                size={120}
                style={{alignSelf: 'center'}}
                treeUpdateInterval={treeUpdateInterval}
              />
            ) : null}

            {treeDetails?.id ? (
              <Text testID="tree-id-text" style={[globalStyles.h3, globalStyles.textCenter]}>
                {Hex2Dec(treeDetails.id)}
              </Text>
            ) : null}
            {/* Tree id */}
            <Spacer times={8} />

            <View style={globalStyles.p2}>
              <Card>
                <View style={styles.updateButton}>
                  {treeDetails && (
                    <Button
                      testID="tree-update-btn"
                      variant="success"
                      caption={t('treeDetails.update')}
                      textStyle={globalStyles.textCenter}
                      onPress={handleUpdate}
                      style={{backgroundColor: treeColor(treeDetails, treeUpdateInterval)}}
                    />
                  )}
                </View>
                <Spacer times={4} />

                {/*
            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Location</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>Lordegan, Iran</Text>
            <Spacer times={6} />
            */}

                {treeDetails?.treeSpecsEntity ? (
                  <>
                    <Text
                      testID="tree-gpsCoords-label"
                      style={[globalStyles.h6, globalStyles.textCenter, styles.header]}
                    >
                      {t('treeDetails.gpsCoords')}
                    </Text>
                    <Text testID="tree-gpsCoords" style={[globalStyles.h5, globalStyles.textCenter]}>
                      {t('treeDetails.coords', {
                        lat: Number(treeDetails?.treeSpecsEntity.latitude) / Math.pow(10, 6),
                        long: Number(treeDetails?.treeSpecsEntity.longitude) / Math.pow(10, 6),
                      })}
                      {/*lat: {Number(treeDetails?.treeSpecsEntity.latitude) / Math.pow(10, 6)}*/}
                      {/*{'\n '}*/}
                      {/*long: {Number(treeDetails?.treeSpecsEntity.longitude) / Math.pow(10, 6)}*/}
                    </Text>
                    <Spacer times={6} />
                  </>
                ) : (
                  <></>
                )}
                {/*<Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Height</Text>*/}
                {/*<Text style={[globalStyles.h5, globalStyles.textCenter]}>{tree.height} cm</Text>*/}
                {/*/!* TBD *!/*/}
                {/*<Spacer times={6} />*/}

                <Text testID="tree-funder-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                  {t('treeDetails.funder')}
                </Text>
                <Text testID="tree-funder" style={[globalStyles.h5, globalStyles.textCenter]}>
                  {treeDetails?.funder == null ? t('treeDetails.notFounded') : treeDetails?.funder?.id}
                </Text>
                <Spacer times={6} />

                <Text testID="tree-lastUpdate-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                  {t('treeDetails.lastUpdate')}
                </Text>
                <Text testID="tree-lastUpdate" style={[globalStyles.h5, globalStyles.textCenter]}>
                  {treeDetails?.lastUpdate != null
                    ? new Date(Number(treeDetails?.lastUpdate?.createdAt) * 1000).toLocaleDateString()
                    : new Date(Number(treeDetails?.plantDate) * 1000).toLocaleDateString()}
                </Text>
                <Spacer times={6} />

                <Text testID="born-date-label" style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                  {t('treeDetails.born')}
                </Text>
                <Text testID="born-date" style={[globalStyles.h5, globalStyles.textCenter]}>
                  {new Date(Number(treeDetails?.plantDate) * 1000).getFullYear()}
                </Text>
                <Spacer times={6} />

                <TouchableOpacity
                  testID="open-map-button"
                  style={{
                    marginHorizontal: -20,
                    marginBottom: -23,
                  }}
                  onPress={() => {
                    const uri = `https://maps.google.com/?q=${
                      Number(treeDetails?.treeSpecsEntity.latitude) / Math.pow(10, 6)
                    },${Number(treeDetails?.treeSpecsEntity.longitude) / Math.pow(10, 6)}`;
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
                      {t(`treeDetails.${updatesCount > 1 ? 'photos' : 'photo'}`)}
                    </Text>
                    <View style={styles.titleLine} />
                  </View>
                  <Spacer times={8} />
                  <TreePhotos
                    testID="tree-photos-cpt"
                    updatesCount={updatesCount}
                    cardWidth={cardWidth}
                    updates={updates}
                  />
                </View>
              )}
            </View>
            <Spacer times={8} />
          </View>
        </PullToRefresh>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#757575',
  },
  updateButton: {
    // position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: -40,
  },
  treeImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
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

export default TreeDetails;
