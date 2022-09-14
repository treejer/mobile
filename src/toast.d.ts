import {
  ToastProps as RNToastProps,
  ToastOptions as RNToastOptions,
} from 'react-native-toast-notifications/lib/typescript/toast';

declare module 'react-native-toast-notifications/lib/typescript/toast' {
  interface ToastProps extends RNToastProps {
    title?: string;
  }
  interface ToastOptions extends RNToastOptions {
    title?: string;
  }
}
