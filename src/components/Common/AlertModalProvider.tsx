import React, {useCallback, useContext, useMemo, useState} from 'react';
import {Modal, StyleSheet, View, Text, TouchableOpacityProps, TextProps, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Card from 'components/Card';

export type TTitle = {text: string; tParams?: any; props?: TextProps};
export type TButton = {text: string; onPress: () => void; btnProps?: TouchableOpacityProps; textProps?: TextProps};
export type TOpenAlertModalArgs = {
  title: TTitle;
  buttons?: TButton[];
  width?: number;
  height?: number;
  bg?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
};

export type TAlertModalContext = {
  visible: boolean;
  openAlertModal: (args: TOpenAlertModalArgs) => void;
  closeAlertModal: () => void;
};

export const alertModalDefaultValue: TAlertModalContext = {
  visible: false,
  openAlertModal: () => {},
  closeAlertModal: () => {},
};

export const AlertModalContext = React.createContext<TAlertModalContext>(alertModalDefaultValue);

export type AlertModalProviderProps = {
  children: JSX.Element | JSX.Element[] | null;
};

const defaultStyles = {
  width: 320,
  height: 150,
  bg: colors.khaki,
  paddingVertical: 20,
  paddingHorizontal: 20,
};

export function AlertModalProvider(props: AlertModalProviderProps) {
  const {children} = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<TTitle>({text: 'Title'});
  const [buttons, setButtons] = useState<TButton[] | null>(null);

  const [modalStyles, setModalStyles] = useState(defaultStyles);

  const {top, bottom} = useSafeAreaInsets();

  const {t} = useTranslation();

  const handleOpenAlertModal = useCallback(
    ({title: newTitle, buttons: newButtons, ...newModalStyles}: TOpenAlertModalArgs) => {
      setTitle(newTitle);
      if (newButtons) {
        setButtons(newButtons);
      }
      setModalStyles({
        ...modalStyles,
        ...newModalStyles,
      });
      setVisible(true);
    },
    [modalStyles],
  );

  const handleCloseAlertModal = useCallback(() => {
    setTitle({text: 'Title'});
    setButtons(null);
    setVisible(false);
    setModalStyles(defaultStyles);
  }, []);

  const alertModalValue = useMemo(
    () => ({
      visible,
      openAlertModal: handleOpenAlertModal,
      closeAlertModal: handleCloseAlertModal,
    }),
    [visible, handleOpenAlertModal, handleCloseAlertModal],
  );

  return (
    <AlertModalContext.Provider value={alertModalValue}>
      <Modal
        testID="alert-modal"
        visible={visible}
        style={{paddingTop: top, paddingBottom: bottom}}
        transparent
        onRequestClose={handleCloseAlertModal}
      >
        <View testID="alert-modal-container" style={styles.container}>
          <Card
            testID="alert-modal-card"
            style={{
              width: modalStyles.width,
              height: modalStyles.height,
              backgroundColor: modalStyles.bg,
              paddingVertical: modalStyles.paddingVertical,
              paddingHorizontal: modalStyles.paddingHorizontal,
              justifyContent: 'space-between',
            }}
          >
            <Text testID="alert-modal-card-title" {...title.props} style={[styles.title, title?.props?.style]}>
              {t(title.text, title.tParams)}
            </Text>
            {buttons ? (
              <View testID="alert-modal-card-btn-container" style={styles.btnContainer}>
                {buttons?.map((button, index) => (
                  <TouchableOpacity
                    testID={`alert-modal-card-btn-${index}`}
                    {...button.btnProps}
                    key={`${button.text}-${index}`}
                    style={[styles.btn, button?.btnProps?.style]}
                    activeOpacity={button?.btnProps?.activeOpacity}
                    onPress={button.onPress}
                  >
                    <Text style={button?.textProps?.style}>{t(button.text)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </Card>
        </View>
      </Modal>
      {children}
    </AlertModalContext.Provider>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBg,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    ...globalStyles.justifyContentCenter,
    ...globalStyles.alignItemsCenter,
    width: 120,
    paddingVertical: 8,
    borderRadius: 120 / 2,
  },
});

export const useAlertModal = () => useContext(AlertModalContext);
