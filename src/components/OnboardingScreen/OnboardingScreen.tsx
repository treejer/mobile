import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import Svg, { Path } from "react-native-svg";
import globalStyles from "../../styles";
import BackgroundEntropy from "../BackgroundEntropy/BackgroundEntropy";
import Button from "../Button";
import { Tree } from "../Icons";
import ProgressCircles from "../ProgressCircles";

// import {
//   OnboardingContent,
//   onboardingData,
//   OnboardingKey,
// } from "./OnboardingContent";

export type OnboardingKey = "step-1" | "step-2" | "step-3";

interface OnboardingData {
  image: number;
  heading: string;
  content: string;
}

const onboardingData: OnboardingData[] = [
  {
    image: require("../../../assets/images/onboarding-1.png"),
    heading: "Connect to your Wallet",
    content:
      "The new member will receive a SMS to join the Green Block in a few minutes.",
  },
  {
    image: require("../../../assets/images/onboarding-2.png"),
    heading: "Plant Trees or Support them",
    content:
      "The new member will receive a SMS to join the Green Block in a few minutes.",
  },
  {
    image: require("../../../assets/images/onboarding-3.png"),
    heading: "Get Rewards",
    content:
      "The new member will receive a SMS to join the Green Block in a few minutes.",
  },
];

function OnboardingScreen() {
  const navigation = useNavigation();
  const { width: viewportWidth } = useWindowDimensions();
  const carouselRef = useRef<Carousel<OnboardingData>>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const isEnd = currentStep === onboardingData.length - 1;
  const currentStepForRenderItem = true ? currentStep : -1;

  const renderItem: ListRenderItem<OnboardingData> = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={[
            globalStyles.fill,
            globalStyles.alignItemsCenter,
            globalStyles.p3,
            globalStyles.justifyContentCenter,
          ]}
          accessibilityElementsHidden={index !== currentStepForRenderItem}
        >
          <View style={[globalStyles.justifyContentEnd]}>
            <Image source={item.image} />
          </View>
          <Text
            style={[globalStyles.h3, globalStyles.textCenter, globalStyles.pt1]}
          >
            {item.heading}
          </Text>
          <Text
            style={[
              globalStyles.normal,
              globalStyles.textCenter,
              globalStyles.pt1,
            ]}
          >
            {item.content}
          </Text>
        </View>
      );
    },
    [currentStepForRenderItem]
  );

  const nextItem = useCallback(async () => {
    if (isEnd) {
      navigation.navigate('SignUp')
      return;
    }
    carouselRef.current?.snapToNext();
  }, [isEnd, navigation]);

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
          <ProgressCircles
            numberOfSteps={onboardingData.length}
            activeStep={currentStep + 1}
          />
        </View>
      </View>
    </View>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  dotContainerStyle: {},
  dotWrapperStyle: {
    marginTop: -14,
    fontSize: 20,
  },
  bottomWrapper: {
    height: 200,
  },
});
