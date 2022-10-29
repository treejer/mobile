import React from 'react';
import {colors} from 'constants/values';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AlertMode, showAlert} from 'utilities/helpers/alert';

export interface SocialLoginButtonProps {
  name: 'Apple' | 'Google' | 'Twitter';
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
}

export function SocialLoginButton(props: SocialLoginButtonProps) {
  const {name, color = colors.grayDarker, disabled, onPress} = props;

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
      <Icon name={name.toLowerCase()} size={24} color={color} />
    </TouchableOpacity>
  );
}
