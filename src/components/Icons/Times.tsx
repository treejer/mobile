import React from 'react';
import Svg, {Line} from 'react-native-svg';

interface Props {
  color: string;
}

function Times({color = 'white'}: Props) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20">
      <Line x1="3.81378" y1="2.98535" x2="17.9559" y2="17.1275" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <Line x1="3.98535" y1="17.1276" x2="18.1275" y2="2.98549" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export default Times;
