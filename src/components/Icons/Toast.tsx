import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';

export type TToastIconProps = {
  name: 'tree' | 'exclamation-circle' | 'exclamation-triangle' | 'info';
};

function ToastIcon(props: TToastIconProps) {
  const {name} = props;

  return <Icon name={name} size={20} color={colors.white} />;
}

export default ToastIcon;
