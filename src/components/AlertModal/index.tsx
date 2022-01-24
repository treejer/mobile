import React from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import FlatButton from '../FlatButton';
import {colors} from 'constants/values';
import globalStyles, {fontBold, fontMedium} from 'constants/styles';

interface AlertModalProps {
  visible: boolean;
  heading: string;
  message?: string;
  primaryBtnText: string;
  onPressPrimaryBtn: any;
  showSecondaryButton?: boolean;
  secondaryBtnText?: string;
  onPressSecondaryBtn?: any;
}

const AlertModal = ({
  visible,
  heading,
  message,
  primaryBtnText,
  onPressPrimaryBtn,
  showSecondaryButton = true,
  secondaryBtnText,
  onPressSecondaryBtn,
}: AlertModalProps) => {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.alertHeader}>{heading}</Text>
          <Text style={styles.alertMessage}>{message}</Text>
          <View style={styles.bottomBtnContainer}>
            {showSecondaryButton && (
              <FlatButton onPress={onPressSecondaryBtn} text={secondaryBtnText} style={styles.secondaryButtonStyle} />
            )}
            <FlatButton onPress={onPressPrimaryBtn} text={primaryBtnText} style={styles.primaryButtonStyle} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  subContainer: {
    width: '90%',
    backgroundColor: colors.khaki,
    borderRadius: 10,
    padding: 20,
  },
  bottomBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  alertHeader: {
    ...globalStyles.h4,
    ...fontBold,
    color: colors.grayDarker,
    marginVertical: 10,
  },
  alertMessage: {
    ...globalStyles.h5,
    ...fontMedium,
    color: colors.grayDarker,
  },
  primaryButtonStyle: {
    marginLeft: 20,
    color: colors.red,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  secondaryButtonStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});

export default AlertModal;
