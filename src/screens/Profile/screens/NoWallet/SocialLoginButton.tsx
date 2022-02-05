import React from 'react';
import {colors} from 'constants/values';
import {Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface SocialLoginButtonProps {
  name: 'Apple' | 'Google' | 'Twitter';
  color?: string;
}

export function SocialLoginButton(props: SocialLoginButtonProps) {
  const {name, color = colors.grayDarker} = props;

  return (
    <TouchableOpacity
      style={{
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderColor: colors.gray,
        borderStyle: 'solid',
        borderWidth: 1,
      }}
      onPress={() => Alert.alert('Not Implemented', 'We are developing...')}
    >
      <Icon name={name.toLowerCase()} size={24} color={color} />
    </TouchableOpacity>
  );
}
