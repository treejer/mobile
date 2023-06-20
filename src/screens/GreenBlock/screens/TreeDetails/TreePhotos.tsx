import React, {useMemo, useRef, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {ChevronLeft, ChevronRight} from 'components/Icons';

export type TreePhotosProps = {
  testID?: string;
  updatesCount: number;
  cardWidth: number;
  updates: any[];
};

export function TreePhotos(props: TreePhotosProps) {
  const {testID, updatesCount, cardWidth, updates} = props;

  const [activeSlide, setActiveSlide] = useState(0);

  const imageWidth = useMemo(() => {
    if (!cardWidth) {
      return undefined;
    }

    if (updatesCount > 1) {
      return cardWidth - 100;
    }

    return cardWidth;
  }, [cardWidth, updatesCount]);

  const sliderRef = useRef<Carousel<any>>(null);

  return (
    <>
      <View
        testID={testID}
        style={[globalStyles.justifyContentCenter, globalStyles.horizontalStack, globalStyles.alignItemsCenter]}
      >
        {updatesCount > 1 && (
          <TouchableOpacity style={[globalStyles.p1]} onPress={() => sliderRef.current?.snapToPrev()}>
            <ChevronLeft />
          </TouchableOpacity>
        )}
        <Carousel
          ref={sliderRef}
          data={updates}
          renderItem={({item: update}) => {
            console.log(update?.preview, 'update.preiwvew');
            return (
              <Image
                style={{
                  width: imageWidth,
                  height: cardWidth,
                  borderRadius: 20,
                }}
                resizeMode="cover"
                key={update.createdAt}
                source={
                  update?.preview
                    ? update.preview?.hasOwnProperty('path')
                      ? {uri: update.preview?.path}
                      : update.preview
                    : {uri: update.image}
                }
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
          <TouchableOpacity style={[globalStyles.p1]} onPress={() => sliderRef.current?.snapToNext()}>
            <ChevronRight />
          </TouchableOpacity>
        )}
      </View>

      {updatesCount > 1 && (
        <Pagination
          dotsLength={updates.length}
          activeDotIndex={activeSlide}
          containerStyle={{
            flexWrap: 'wrap',
          }}
          dotColor={colors.grayDarker}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
            marginVertical: 8,
          }}
          inactiveDotColor={colors.gray}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={sliderRef.current || undefined}
          tappableDots={Boolean(sliderRef.current)}
        />
      )}
    </>
  );
}
