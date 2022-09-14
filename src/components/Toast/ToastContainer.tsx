import React, {ReactNode} from 'react';
import {ToastProvider} from 'react-native-toast-notifications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {AlertMode} from 'utilities/helpers/alert';
import {CustomToast} from 'components/Toast/CustomToast';
import {ToastIcon} from 'components/Icons';

export type ToastContainerProps = {
  children?: ReactNode;
};

export const toastProviderProps = {
  placement: 'top' as 'top' | 'bottom' | 'center' | undefined,
  swipeEnabled: true,
  renderType: {
    [AlertMode.Success]: toastOptions => (
      <CustomToast
        toastOptions={{...toastOptions, icon: toastOptions.icon ?? <ToastIcon name="tree" />}}
        mode={AlertMode.Success}
      />
    ),
    [AlertMode.Warning]: toastOptions => (
      <CustomToast
        toastOptions={{...toastOptions, icon: toastOptions.icon ?? <ToastIcon name="exclamation-triangle" />}}
        mode={AlertMode.Warning}
      />
    ),
    normal: toastOptions => (
      <CustomToast
        toastOptions={{...toastOptions, icon: toastOptions.icon ?? <ToastIcon name="info" />}}
        mode={AlertMode.Info}
      />
    ),
    [AlertMode.Error]: toastOptions => (
      <CustomToast
        toastOptions={{...toastOptions, icon: toastOptions.icon ?? <ToastIcon name="exclamation-circle" />}}
        mode={AlertMode.Error}
      />
    ),
  },
};

export function ToastContainer(props: ToastContainerProps) {
  const {children} = props;

  const {top} = useSafeAreaInsets();

  return (
    <ToastProvider
      {...toastProviderProps}
      offsetTop={top}
      // renderToast={toastOptions => <CustomToast toastOptions={toastOptions} />}
    >
      {children}
    </ToastProvider>
  );
}
