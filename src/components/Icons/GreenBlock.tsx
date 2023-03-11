import {colors} from 'constants/values';

import React from 'react';
import Animated from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';
import {useTransition} from 'utilities/hooks';
import {isWeb} from 'utilities/helpers/web';

interface Props {
  color?: string;
  fill?: boolean;
}

const AnimatedPath = isWeb() ? Path : Animated.createAnimatedComponent(Path);

Animated.addWhitelistedNativeProps({
  fillOpacity: true,
});

function GreenBlock({color = colors.green, fill = false}: Props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const fillOpacity = isWeb() ? Number(fill) : useTransition(fill);

  return (
    <Svg width="30" height="24" viewBox="0 0 30 24" fill="none">
      <AnimatedPath
        d="M20.6605 17.6788H9.33949C4.72967 17.6788 1 13.9491 1 9.33929C1 4.72947 4.72967 0.999802 9.33949 0.999802H20.6605C25.2703 0.999802 29 4.72947 29 9.33929C29 13.9491 25.2703 17.6788 20.6605 17.6788Z"
        fill={color}
        fillOpacity={fillOpacity as any}
      />
      <Path
        d="M20.6605 17.879H9.33949C4.72967 17.879 1 14.1493 1 9.53949C1 4.92966 4.72967 1.2 9.33949 1.2H20.6605C25.2703 1.2 29 4.92966 29 9.53949C29 14.1493 25.2703 17.879 20.6605 17.879Z"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.525 7.64243L20.525 22.8218"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.3307 15.0299C20.3307 15.0299 16.557 14.9198 16.7991 10.8821"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.7373 12.5435C21.7385 12.5435 24.2689 11.4983 24.2689 8.52781"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.0256 7.64243L10.0256 22.8218"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.0102 12.5435C11.0114 12.5435 13.5419 11.4983 13.5419 8.52781"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.84522 15.0303C9.84522 15.0303 6.07155 14.9203 6.31359 10.8826"
        stroke="#757575"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default GreenBlock;
