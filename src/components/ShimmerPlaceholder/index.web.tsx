import React from 'react';
import {Text, View} from 'react-native';
import Skeleton from 'react-loading-skeleton';

interface ShimmerPlaceHolderPropsType {
  style: React.CSSProperties;
}

export default function ShimmerPlaceHolder({style}: ShimmerPlaceHolderPropsType) {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Skeleton style={style} />
    </View>
  );
}
