import React from 'react';
import {TouchableOpacity} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export type SearchButtonProps = {
  testID?: string;
  icon?: string;
  onPress: () => void;
};

export function SearchButton(props: SearchButtonProps) {
  const {icon, onPress, testID} = props;

  return (
    <TouchableOpacity
      testID={testID}
      style={[globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}
      onPress={onPress}
    >
      <FIcon testID="icon" name={icon || 'search'} color={colors.black} size={22} />
    </TouchableOpacity>
  );
}
