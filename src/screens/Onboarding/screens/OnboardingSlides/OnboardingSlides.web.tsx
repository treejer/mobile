import globalStyles from 'constants/styles';

import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import BackgroundEntropy from 'components/BackgroundEntropy/BackgroundEntropy';
import Button from 'components/Button';
import {Tree} from 'components/Icons';
import ProgressCircles from 'components/ProgressCircles';
import {useSettings} from 'services/settings';
import {useTranslation} from 'react-i18next';
import Slider from 'react-slick';

export type OnboardingKey = 'step-1' | 'step-2' | 'step-3';

interface OnboardingData {
  image: number;
  heading: string;
  content: string;
}

function OnboardingScreen() {
  const {t} = useTranslation();

  const carouselRef = useRef<Slider>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: false,
      arrows: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: value => setCurrentStep(value),
    }),
    [],
  );

  const onboardingData: OnboardingData[] = [
    {
      image: require('../../../../../assets/images/onboarding-1.png'),
      heading: t('onBoarding.first.title'),
      content: t('onBoarding.first.details'),
    },
    {
      image: require('../../../../../assets/images/onboarding-2.png'),
      heading: t('onBoarding.second.title'),
      content: t('onBoarding.second.details'),
    },
    {
      image: require('../../../../../assets/images/onboarding-3.png'),
      heading: t('onBoarding.third.title'),
      content: t('onBoarding.third.details'),
    },
  ];
  const isEnd = currentStep === onboardingData.length - 1;
  const {markOnboardingAsDone} = useSettings();

  const nextItem = useCallback(async () => {
    if (isEnd) {
      return markOnboardingAsDone();
    }
    carouselRef.current?.slickNext();
  }, [isEnd, markOnboardingAsDone]);

  return (
    <View style={globalStyles.fill}>
      <BackgroundEntropy />
      <View style={globalStyles.fill}>
        <Slider {...settings} ref={carouselRef}>
          {onboardingData?.map(item => (
            <div key={item.heading}>
              <View style={styles.sliderWrapper}>
                <View style={[globalStyles.justifyContentEnd]}>
                  <Image source={item.image} style={styles.sliderImage} />
                </View>
                <Text style={[globalStyles.h3, globalStyles.textCenter, globalStyles.pt1]}>{item.heading}</Text>
                <Text style={[globalStyles.normal, globalStyles.textCenter, globalStyles.pt1]}>{item.content}</Text>
              </View>
            </div>
          ))}
        </Slider>
      </View>
      <View style={[styles.bottomWrapper, globalStyles.alignItemsCenter]}>
        <View style={globalStyles.pt3}>
          <Button variant="cta" caption={t('next')} icon={Tree} onPress={nextItem} />
        </View>

        <View style={globalStyles.pt3}>
          <ProgressCircles numberOfSteps={onboardingData.length} activeStep={currentStep + 1} />
        </View>
      </View>
    </View>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  bottomWrapper: {
    height: 200,
  },
  sliderWrapper: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sliderImage: {
    height: 300,
    width: 300,
  },
});
