import React from 'react';
import Svg, {Line} from 'react-native-svg';
import {TouchableOpacity} from 'react-native';

interface Props {
  color?: string;
  onPress?: () => void;
}

function Plus({color = 'white', onPress}: Props) {
  return (
    <TouchableOpacity onPress={onPress || undefined} activeOpacity={!onPress ? 1 : undefined}>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Line x1="12" y1="1" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Line x1="1" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </Svg>
    </TouchableOpacity>
  );
}

export default Plus;
