import React from 'react';
import {Keyboard, TouchableWithoutFeedback, TouchableWithoutFeedbackProps} from 'react-native';

export interface KeyboardDismissProps extends TouchableWithoutFeedbackProps {
  noDismiss?: boolean;
}

export default function KeyboardDismiss(props: KeyboardDismissProps) {
  const {noDismiss} = props;

  const handlePress = () => {
    if (!noDismiss) {
      Keyboard.dismiss();
    }
  };

  return <TouchableWithoutFeedback style={{flex: 1}} onPress={handlePress} {...props} />;
}
