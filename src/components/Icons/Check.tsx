import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface Props {
  color?: string;
}

function Check({color = 'white'}: Props) {
  return (
    <Svg width="23" height="18" viewBox="0 0 23 18" fill="none">
      <Path d="M3.49998 8.67869L8.80328 13.982" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <Path d="M9.125 14.3036L18.875 3.75012" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export default Check;
