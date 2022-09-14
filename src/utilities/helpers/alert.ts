import {Alert, AlertButton, AlertOptions} from 'react-native';
// import {toast} from 'react-toastify';
import {isWeb} from './web';
import {ToastOptions} from 'react-native-toast-notifications/lib/typescript/toast';
import {useToast} from 'react-native-toast-notifications';

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
  Warning = 'warning',
  Error = 'error',
}

export function showAlert(options: ShowAlertOptions) {
  const {message, title, mode = AlertMode.Info, buttons, alertOptions} = options;

  if (mode) {
    toast.show?.(message, {type: mode, title});
  } else {
    toast.show?.(message, {data: {title}});
  }
  // * Alert.alert(title, message, buttons, alertOptions);
}

export function showSagaAlert(options: ShowAlertOptions) {
  const {message, title = 'Alert', buttons, alertOptions, mode} = options;

  return new Promise((resolve, reject) => {
    const _buttons = buttons ?? [
      {
        text: 'OK',
        onPress: () => {
          resolve('ok');
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          reject();
        },
      },
    ];

    showAlert({
      title,
      message,
      buttons: _buttons,
      alertOptions: alertOptions ?? {cancelable: false},
      mode,
    });
  });
}
