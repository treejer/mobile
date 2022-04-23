import React from 'react';
import {Text, View} from 'react-native';
import Skeleton from 'react-loading-skeleton';

export default function ShimmerPlaceHolder({style}) {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Skeleton style={style} />
    </View>
  );
}
