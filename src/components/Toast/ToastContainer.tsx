import React, {ReactNode} from 'react';
import {ToastProvider} from 'react-native-toast-notifications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {AlertMode} from 'utilities/helpers/alert';
import {CustomToast} from 'components/Toast/CustomToast';

export type ToastContainerProps = {
  children?: ReactNode;
};
export function ToastContainer(props: ToastContainerProps) {
  const {children} = props;

  const {top} = useSafeAreaInsets();

  return (
    <ToastProvider
      placement="top"
      offsetTop={top}
      swipeEnabled={true}
      renderType={{
        [AlertMode.Success]: toastOptions => <CustomToast toastOptions={toastOptions} mode={AlertMode.Success} />,
        [AlertMode.Warning]: toastOptions => <CustomToast toastOptions={toastOptions} mode={AlertMode.Warning} />,
        normal: toastOptions => <CustomToast toastOptions={toastOptions} mode={AlertMode.Info} />,
        [AlertMode.Error]: toastOptions => <CustomToast toastOptions={toastOptions} mode={AlertMode.Error} />,
      }}
      // renderToast={toastOptions => <CustomToast toastOptions={toastOptions} />}
    >
      {children}
    </ToastProvider>
  );
}
