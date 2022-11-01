import React from 'react';
import {colors} from 'constants/values';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {AlertMode, showAlert} from 'utilities/helpers/alert';

export interface SocialLoginButtonProps {
  name: 'Facebook' | 'Google' | 'Discord';
  disabled?: boolean;
  onPress?: () => void;
}

export const socialLoginButtonIcons = {
  Facebook: {
    color: '#4267B2',
    name: 'facebook-f',
  },
  Google: {
    color: '#DB4437',
    name: 'google',
  },
  Discord: {
    color: '#7289da',
    name: 'discord',
  },
};

export function SocialLoginButton(props: SocialLoginButtonProps) {
  const {name, disabled, onPress} = props;

  return (
    <TouchableOpacity
      style={{
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: socialLoginButtonIcons[name].color,
      }}
      onPress={() =>
        onPress
          ? onPress()
          : showAlert({
              title: 'Not Implemented',
              message: 'We are developing...',
              mode: AlertMode.Info,
            })
      }
      disabled={disabled}
    >
      <Icon name={socialLoginButtonIcons[name].name} size={28} color={colors.white} />
    </TouchableOpacity>
  );
}
