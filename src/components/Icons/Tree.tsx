import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface Props {
  color: string;
  size: number;
}

function TreeSvg({color = 'white', size = 20}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 17 20" fill="none">
      <Path
        d="M9.30109 14.627H7.60684C3.80419 14.627 0.722275 11.5451 0.722275 7.74248C0.722275 3.93983 3.80419 0.85791 7.60684 0.85791H9.30109C13.1037 0.85791 16.1857 3.93983 16.1857 7.74248C16.1857 11.5451 13.1037 14.627 9.30109 14.627Z"
        stroke={color}
        strokeWidth="1.12346"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.92966 5.33398L8.92966 18.7648"
        stroke={color}
        strokeWidth="1.12346"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.9195 10.8358C8.9195 10.8358 11.7648 9.49113 12.2112 7.09229"
        stroke={color}
        strokeWidth="1.12346"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.91958 12.772C8.91958 12.772 5.402 12.6698 5.62789 8.90479"
        stroke={color}
        strokeWidth="1.12346"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default TreeSvg;
