import React from 'react';
import {View, ViewProps} from 'react-native';

import {colors} from 'constants/values';

export type THrProps = {
  styles?: ViewProps['style'];
};

export function Hr({styles}: THrProps) {
  return <View style={[{height: 1, backgroundColor: colors.khakiDark}, styles]} />;
}
