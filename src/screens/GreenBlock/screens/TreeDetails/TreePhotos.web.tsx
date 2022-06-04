import React, {useMemo, useRef} from 'react';
import Slider from 'react-slick';
import {Image} from 'react-native';

export type TreePhotosProps = {
  updatesCount: number;
  cardWidth: number;
  updates: any[];
};

export function TreePhotos(props: TreePhotosProps) {
  const {updatesCount, cardWidth, updates} = props;

  const carouselRef = useRef<Slider>(null);
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: true,
      arrows: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    }),
    [],
  );

  const imageWidth = useMemo(() => {
    if (!cardWidth) {
      return undefined;
    }

    if (updatesCount > 1) {
      return cardWidth - 120;
    }

    return cardWidth;
  }, [cardWidth, updatesCount]);

  return (
    <div id="tree-photos">
      <Slider {...settings} ref={carouselRef}>
        {updates?.map((item, i) => (
          <div key={i} className="m-auto">
            <Image
              style={{
                width: (imageWidth || 0) + (updatesCount > 1 ? 20 : 0),
                height: cardWidth,
                borderRadius: 20,
                margin: 'auto',
              }}
              resizeMode="cover"
              source={{uri: item.image}}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
