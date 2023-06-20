import {Alert, AlertButton} from 'react-native';
import {DefaultTFuncReturn} from 'i18next';

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
  message: string | DefaultTFuncReturn;
  title?: string | DefaultTFuncReturn;
  mode?: AlertMode;
  alertOptions?: {
    tParams?: {
      title?: any;
      message?: any;
    };
    translate?: boolean;
  };
};

export enum AlertMode {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export function showAlert(options: ShowAlertOptions) {
  const {message, title, mode = AlertMode.Info, alertOptions} = options;

  if (mode) {
    toast?.show?.(message, {type: mode, title, ...alertOptions});
  } else {
    toast?.show?.(message, {data: {title, ...alertOptions}});
  }
  // * Alert.alert(title, message, buttons, alertOptions);
}

export function* showSagaAlert(options: ShowAlertOptions) {
  const {message, title = 'Alert', alertOptions, mode} = options;

  return showAlert({
    title,
    message,
    alertOptions,
    mode,
  });
}
