import globalStyles from 'constants/styles';

import React, {useCallback, useRef, useState} from 'react';
import {Image, ListRenderItem, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import BackgroundEntropy from 'components/BackgroundEntropy/BackgroundEntropy';
import Button from 'components/Button';
import {Tree} from 'components/Icons';
import ProgressCircles from 'components/ProgressCircles';
import {useSettings} from 'services/settings';

export type OnboardingKey = 'step-1' | 'step-2' | 'step-3';

interface OnboardingData {
  image: number;
  heading: string;
  content: string;
}

const onboardingData: OnboardingData[] = [
  {
    image: require('../../../../../assets/images/onboarding-1.png'),
    heading: 'Connect to your Wallet',
    content: 'The new member will receive a SMS to join the Green Block in a few minutes.',
  },
  {
    image: require('../../../../../assets/images/onboarding-2.png'),
    heading: 'Plant Trees or Support them',
    content: 'The new member will receive a SMS to join the Green Block in a few minutes.',
  },
  {
    image: require('../../../../../assets/images/onboarding-3.png'),
    heading: 'Get Rewards',
    content: 'The new member will receive a SMS to join the Green Block in a few minutes.',
  },
];

function OnboardingScreen() {
  // const navigation = useNavigation();
  const {width: viewportWidth} = useWindowDimensions();
  const carouselRef = useRef<Carousel<OnboardingData>>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const isEnd = currentStep === onboardingData.length - 1;
  const currentStepForRenderItem = currentStep;
  const {markOnboardingAsDone} = useSettings();

  const renderItem: ListRenderItem<OnboardingData> = useCallback(
    ({item, index}) => {
      return (
        <View
          style={[globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.p3, globalStyles.justifyContentCenter]}
          accessibilityElementsHidden={index !== currentStepForRenderItem}
        >
          <View style={[globalStyles.justifyContentEnd]}>
            <Image source={item.image} />
          </View>
          <Text style={[globalStyles.h3, globalStyles.textCenter, globalStyles.pt1]}>{item.heading}</Text>
          <Text style={[globalStyles.normal, globalStyles.textCenter, globalStyles.pt1]}>{item.content}</Text>
        </View>
      );
    },
    [currentStepForRenderItem],
  );

  const nextItem = useCallback(async () => {
    if (isEnd) {
      return markOnboardingAsDone();
    }
    carouselRef.current?.snapToNext();
  }, [isEnd, markOnboardingAsDone]);

  const onSnapToItem = useCallback((newIndex: number) => {
    setCurrentStep(newIndex);
  }, []);

  return (
    <View style={globalStyles.fill}>
      <BackgroundEntropy />
      <View style={globalStyles.fill}>
        <Carousel
          ref={carouselRef}
          data={onboardingData}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          onSnapToItem={onSnapToItem}
          importantForAccessibility="no"
          accessible={false}
          initialNumToRender={1}
        />
      </View>
      <View style={[styles.bottomWrapper, globalStyles.alignItemsCenter]}>
        <View style={globalStyles.pt3}>
          <Button variant="cta" caption="NEXT" icon={Tree} onPress={nextItem} />
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
});
