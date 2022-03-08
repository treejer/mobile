import React from 'react';
import {Keyboard, TouchableWithoutFeedback, TouchableWithoutFeedbackProps} from 'react-native';

export default function KeyboardDismiss(props: TouchableWithoutFeedbackProps) {
  const handlePress = () => {
    console.log('called');
    Keyboard.dismiss();
  };

  return <TouchableWithoutFeedback style={{flex: 1}} onPress={handlePress} {...props} />;
}
