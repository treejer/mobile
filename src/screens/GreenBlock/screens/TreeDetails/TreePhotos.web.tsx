import React, {useMemo, useRef, useState} from 'react';
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
  const [currentStep, setCurrentStep] = useState(0);
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: false,
      arrows: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: value => setCurrentStep(value),
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
        {updates?.map(item => (
          <div key={item.createdAt} className="m-auto">
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
