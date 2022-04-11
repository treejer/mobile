import {Alert, AlertButton, AlertOptions} from 'react-native';
import {toast} from 'react-toastify';
import {isWeb} from './web';

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

export type ShowAlertOptions = {
  message: string;
  title?: string;
  mode?: AlertMode;
  buttons?: AlertButton[];
  alertOptions?: AlertOptions;
};

export enum AlertMode {
  Success = 'success',
  Info = 'info',
  Warning = 'Warning',
  Error = 'error',
}

export function showAlert(options: ShowAlertOptions) {
  const {message, title = 'Alert', mode = AlertMode.Info, buttons, alertOptions} = options;
  if (isWeb()) {
    if (mode) {
      toast[mode](message);
    } else {
      toast(message);
    }
  } else {
    Alert.alert(title, message, buttons, alertOptions);
  }
}
