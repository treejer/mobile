import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation, useRoute, RouteProp, NavigationProp} from '@react-navigation/native';
import {useQuery, NetworkStatus} from '@apollo/client';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
import Spacer from 'components/Spacer';
import {ChevronLeft, ChevronRight} from 'components/Icons';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Button from 'components/Button';
import {GreenBlockRouteParamList} from 'types';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {Hex2Dec} from 'utilities/helpers/hex';
import {useTreeFactory} from 'services/web3';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {currentTimestamp} from 'utilities/helpers/date';
import {useTranslation} from 'react-i18next';
import {useAnalytics} from 'utilities/hooks/useAnalytics';

interface Props {}

const {width} = Dimensions.get('window');

function TreeDetails(_: Props) {
  const navigation = useNavigation<NavigationProp<GreenBlockRouteParamList>>();
  const [treeUpdateInterval, setTreeUpdateInterval] = useState(null);
  // const sliderRef = useRef<Carousel<any>>(null);
  const {
    params: {tree},
  } = useRoute<RouteProp<GreenBlockRouteParamList, 'TreeDetails'>>();

  const {sendEvent} = useAnalytics();

  const {t} = useTranslation();

  const {loading, data, networkStatus, refetch} = useQuery<TreeDetailQueryQueryData>(TreeDetailQuery, {
    variables: {
      id: tree?.id,
    },
  });

  const treeFactory = useTreeFactory();

  useEffect(() => {
    treeFactory.methods
      .treeUpdateInterval()
      .call()
      .then(data => {
        setTreeUpdateInterval(data);
      })
      .catch(e => console.log(e, 'e is here'));
  }, [treeFactory.methods]);

  const treeDetails = useMemo(() => data?.tree || tree, [data?.tree, tree]);

  // console.log(new Date(Number(treeDetails?.birthDate) * 1000), '====> treeDetails?.birthDate <====');
  // console.log(treeDetails?.birthDate, '====> treeDetails?.birthDate <====');

  const staticMapUrl = useMemo(
    () =>
      getStaticMapboxUrl(
        Number(treeDetails?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
        Number(treeDetails?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
        600,
        300,
      ),
    [treeDetails?.treeSpecsEntity?.latitude, treeDetails?.treeSpecsEntity?.longitude],
  );

  const updates = useMemo(
    () =>
      typeof treeDetails?.treeSpecsEntity?.updates != 'undefined' && treeDetails?.treeSpecsEntity?.updates != ''
        ? JSON.parse(treeDetails?.treeSpecsEntity?.updates)
        : [],
    [treeDetails?.treeSpecsEntity?.updates],
  );
  const updatesCount = updates?.length;

  const [activeSlide, setActiveSlide] = useState(0);
  const cardWidth = useMemo(() => width - globalStyles.p2.padding - globalStyles.p3.padding, []);
  const imageWidth = useMemo(() => {
    if (!cardWidth) {
      return null;
    }

    if (updatesCount > 1) {
      return cardWidth - 120;
    }

    return cardWidth;
  }, [cardWidth, updatesCount]);

  // useEffect(() => {
  //   console.log(cardRef.current, '<=====');
  //   if (cardRef.current) {
  //     cardRef.current.measureInWindow((_x, _y, width) => {
  //       setCardWidth(width);
  //     });
  //   }
  // }, [cardRef]);

  const handleUpdate = () => {
    if (treeDetails?.lastUpdate?.updateStatus?.toString() === '1') {
      Alert.alert(t('treeDetails.cannotUpdate.title'), t('treeDetails.cannotUpdate.details'));
      return;
    }

    const differUpdateTime =
      Number(treeDetails.plantDate) + Number(treeDetails.treeStatus * 3600 + Number(treeUpdateInterval));
    const diff = currentTimestamp() - differUpdateTime;

    if (diff < 0) {
      // @here convert to HH:MM:SS
      Alert.alert(t('treeDetails.cannotUpdate.details'), t('treeDetails.cannotUpdate.wait', {seconds: Math.abs(diff)}));
      return;
    }
    sendEvent('update_tree');

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'TreeSubmission',
          params: {
            initialRouteName: 'SelectPhoto',
            treeIdToUpdate: tree.id,
            tree: treeDetails,
            location: {
              latitude: Number(treeDetails?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
              longitude: Number(treeDetails?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
            },
          },
        },
      ],
    });
  };

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={colors.green} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[globalStyles.screenView, globalStyles.fill]}
      refreshControl={
        <RefreshControl refreshing={networkStatus === NetworkStatus.refetch} onRefresh={() => refetch()} />
      }
    >
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.p3]}>
          <TouchableOpacity style={{paddingHorizontal: 16, paddingVertical: 8}} onPress={() => navigation.goBack()}>
            <ChevronLeft />
          </TouchableOpacity>
          <View style={globalStyles.fill} />
          <Avatar size={40} type="active" />
        </View>

        <Image style={[styles.treeImage]} source={require('../../../../../assets/icons/tree.png')} />

        <Text style={[globalStyles.h3, globalStyles.textCenter]}>{Hex2Dec(treeDetails?.id)}</Text>
        {/* Tree id */}
        <Spacer times={8} />

        <View style={globalStyles.p2}>
          <Card>
            <View style={styles.updateButton}>
              {treeDetails && (
                <Button
                  variant="success"
                  caption={t('treeDetails.update')}
                  textStyle={globalStyles.textCenter}
                  onPress={handleUpdate}
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
                <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>
                  {t('treeDetails.gpsCoords')}
                </Text>
                <Text style={[globalStyles.h5, globalStyles.textCenter]}>
                  lat: {Number(treeDetails?.treeSpecsEntity.latitude) / Math.pow(10, 6)}
                  {'\n '}
                  long: {Number(treeDetails?.treeSpecsEntity.longitude) / Math.pow(10, 6)}
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

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>{t('treeDetails.funder')}</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {treeDetails?.funder == null ? t('treeDetails.notFounded') : treeDetails?.funder?.id}
            </Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>{t('treeDetails.lastUpdate')}</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {treeDetails?.lastUpdate != null
                ? new Date(Number(treeDetails?.lastUpdate?.createdAt) * 1000).toLocaleDateString()
                : new Date(Number(treeDetails?.plantDate) * 1000).toLocaleDateString()}
            </Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>{t('treeDetails.born')}</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {new Date(Number(treeDetails?.plantDate) * 1000).getFullYear()}
            </Text>
            <Spacer times={6} />

            <TouchableOpacity
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
                load
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
              <View
                style={[globalStyles.justifyContentCenter, globalStyles.horizontalStack, globalStyles.alignItemsCenter]}
              >
                {/* {updatesCount > 1 && (
                  <TouchableOpacity style={[globalStyles.p1]} onPress={() => sliderRef.current.snapToPrev()}>
                    <ChevronLeft />
                  </TouchableOpacity>
                )}
                <Carousel
                  ref={sliderRef}
                  data={updates}
                  renderItem={({item: update}) => {
                    return (
                      <Image
                        style={{
                          width: imageWidth + (updatesCount > 1 ? 20 : 0),
                          height: cardWidth,
                          borderRadius: 20,
                        }}
                        resizeMode="cover"
                        key={update.createdAt}
                        source={{uri: update.image}}
                      />
                    );
                  }}
                  sliderWidth={imageWidth}
                  itemWidth={imageWidth}
                  inactiveSlideScale={0.95}
                  inactiveSlideOpacity={0}
                  activeSlideAlignment="start"
                  activeAnimationType="spring"
                  layout="default"
                  loop
                  onSnapToItem={index => setActiveSlide(index)}
                />
                {updatesCount > 1 && (
                  <TouchableOpacity style={[globalStyles.p1]} onPress={() => sliderRef.current.snapToNext()}>
                    <ChevronRight />
                  </TouchableOpacity>
                )} */}
              </View>

              {/* {updatesCount > 1 && (
                <Pagination
                  dotsLength={updates.length}
                  activeDotIndex={activeSlide}
                  containerStyle={{}}
                  dotColor={colors.grayDarker}
                  dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 8,
                  }}
                  inactiveDotColor={colors.gray}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={sliderRef.current}
                  tappableDots={Boolean(sliderRef.current)}
                />
              )}*/}
            </View>
          )}
        </View>
        <Spacer times={8} />
      </View>
    </ScrollView>
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
    width: 100,
    height: 100,
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
