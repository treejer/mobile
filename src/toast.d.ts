import {
  ToastProps as RNToastProps,
  ToastOptions as RNToastOptions,
} from 'react-native-toast-notifications/lib/typescript/toast';

declare module 'react-native-toast-notifications/lib/typescript/toast' {
  interface ToastProps extends RNToastProps {
    title?: string;
    translate?: boolean;
    tParams?: {
      title?: any;
      message?: any;
    };
  }
  interface ToastOptions extends RNToastOptions {
    title?: string;
    translate?: boolean;
    tParams?: {
      title?: any;
      message?: any;
    };
  }
}
