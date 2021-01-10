import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Linking, ActivityIndicator} from 'react-native';
import {useNavigation, useRoute, RouteProp, NavigationProp} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {ChevronLeft, ChevronRight} from 'components/Icons';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Button from 'components/Button';
import {getStaticMapUrl} from 'utilities/helpers';

import {GreenBlockRouteParamList} from '../../GreenBlock';
import TreeDetailsQuery, {TreeDetailsQueryQueryData} from './graphql/TreeDetailsQuery.graphql';
import {useQuery} from '@apollo/react-hooks';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {colors} from 'constants/values';

interface Props {}

function TreeDetails(_: Props) {
  const navigation = useNavigation<NavigationProp<GreenBlockRouteParamList>>();
  const cardRef = useRef<View>();
  const sliderRef = useRef<Carousel<any>>();
  const {
    params: {tree},
  } = useRoute<RouteProp<GreenBlockRouteParamList, 'TreeDetails'>>();
  const {loading, data} = useQuery<TreeDetailsQueryQueryData>(TreeDetailsQuery, {
    variables: {
      id: tree.treeId,
    },
    returnPartialData: true,
  });

  const mapImageUrl = getStaticMapUrl({
    markers: [
      {
        coordinate: {
          lat: Number(tree.latitude),
          lng: Number(tree.longitude),
        },
      },
    ],
    width: 600,
    height: 300,
  });

  const updates = data?.tree?.updates;
  const updatesCount = updates?.length ?? 0;

  const [activeSlide, setActiveSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState<number | null>(null);
  const imageWidth = useMemo(() => {
    if (!cardWidth) {
      return null;
    }

    if (updatesCount > 1) {
      return cardWidth - 120;
    }

    return cardWidth;
  }, [cardWidth, updatesCount]);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.measureInWindow((_x, _y, width) => {
        setCardWidth(width);
      });
    }
  }, [cardRef]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.p3]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft />
          </TouchableOpacity>
          <View style={globalStyles.fill} />
          <Avatar size={40} type="active" />
        </View>

        <Image style={[styles.treeImage]} source={require('../../../../../assets/icons/tree.png')} />
        <Text style={[globalStyles.h3, globalStyles.textCenter]}>{tree.treeId}</Text>
        {/* Tree id */}
        <Spacer times={8} />

        <View style={globalStyles.p2}>
          <Card ref={cardRef}>
            <View style={styles.updateButton}>
              <Button
                variant="success"
                caption="Update"
                textStyle={globalStyles.textCenter}
                onPress={() => {
                  navigation.navigate('TreeUpdate', {
                    treeIdToUpdate: tree.treeId,
                  });
                }}
              />
            </View>
            <Spacer times={4} />

            {/*
            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Location</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>Lordegan, Iran</Text>
            <Spacer times={6} />
            */}

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>GPS Coordinates</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {Number(tree.latitude).toFixed(5)}, {Number(tree.longitude).toFixed(5)}
            </Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Height</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>{tree.height} cm</Text>
            {/* TBD */}
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Last Update</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {new Date(tree.updatedAt).toLocaleDateString()}
            </Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Born</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>{new Date(tree.createdAt).getFullYear()}</Text>
            <Spacer times={6} />

            <TouchableOpacity
              style={{
                marginHorizontal: -20,
                marginBottom: -23,
              }}
              onPress={() => {
                Linking.openURL(
                  `https://www.google.com/maps?q=loc:${encodeURIComponent(
                    `${tree.latitude},${tree.longitude}`,
                  )}&zoom=6`,
                );
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
                  uri: mapImageUrl,
                }}
              />
            </TouchableOpacity>
          </Card>
          <Spacer times={8} />

          {loading && <ActivityIndicator color={colors.green} size="large" />}

          {Boolean(cardWidth) && updates && updatesCount > 0 && (
            <View>
              <View
                style={[
                  globalStyles.horizontalStack,
                  globalStyles.alignItemsCenter,
                  styles.titleContainer,
                  {width: imageWidth},
                ]}
              >
                <View style={styles.titleLine} />
                <Text style={[globalStyles.ph1, globalStyles.h5]}>Photos</Text>
                <View style={styles.titleLine} />
              </View>
              <Spacer times={8} />
              <View
                style={[globalStyles.justifyContentCenter, globalStyles.horizontalStack, globalStyles.alignItemsCenter]}
              >
                {updatesCount > 1 && (
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
                        style={{width: imageWidth + (updatesCount > 1 ? 20 : 0), height: cardWidth, borderRadius: 20}}
                        resizeMode="cover"
                        key={update.id}
                        source={{uri: update.image}}
                      />
                    );
                  }}
                  sliderWidth={imageWidth}
                  itemWidth={imageWidth}
                  inactiveSlideScale={0.95}
                  inactiveSlideOpacity={0}
                  activeSlideAlignment="start"
                  activeAnimationType={'spring'}
                  layout="default"
                  loop
                  onSnapToItem={index => setActiveSlide(index)}
                />
                {updatesCount > 1 && (
                  <TouchableOpacity style={[globalStyles.p1]} onPress={() => sliderRef.current.snapToNext()}>
                    <ChevronRight />
                  </TouchableOpacity>
                )}
              </View>

              {updatesCount > 1 && (
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
                  tappableDots={!!sliderRef.current}
                />
              )}
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
    position: 'absolute',
    alignItems: 'center',
    left: 0,
    right: 0,
    marginTop: -20,
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
