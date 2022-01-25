import {Alert, AlertButton} from 'react-native';

export function asyncAlert(
  title: string,
  message: string,
  resolveButton: AlertButton,
  rejectButton?: AlertButton,
  reverse?: boolean,
) {
  return new Promise((resolve, reject) => {
    let buttons: AlertButton[] = [
      {
        text: rejectButton?.text || 'Cancel',
        onPress: reject,
        style: rejectButton?.style,
      },
      {
        text: resolveButton?.text || 'OK',
        onPress: resolve,
        style: resolveButton?.style,
      },
    ];
    if (reverse) {
      buttons = buttons.reverse();
    }
    Alert.alert(title, message, buttons);
  });
}
