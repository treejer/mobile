import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {RenderIf} from 'components/Common/RenderIf';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export type ChangeSettingsAlertProps = {
  testID?: string;
  isDrafted?: boolean;
  onReject: () => void;
  onApprove: () => void;
};

export function ChangeSettingsAlert(props: ChangeSettingsAlertProps) {
  const {testID, isDrafted, onReject, onApprove} = props;

  const {t} = useTranslation();

  return (
    <Modal testID={testID} style={styles.modal} transparent onRequestClose={onReject}>
      <View style={styles.container}>
        <Card style={styles.box}>
          <Text testID="change-settings-alert-title" style={styles.title}>
            {t('submitTreeV2.titles.changeSettings')}
          </Text>
          <RenderIf condition={!!isDrafted}>
            <Spacer />
            <Text testID="change-settings-draft-message" style={styles.desc}>
              {t('submitTreeV2.descriptions.draftWillRemove')}
            </Text>
          </RenderIf>
          <Spacer times={8} />
          <View style={styles.btnContainer}>
            <TouchableOpacity testID="reject-btn" style={[styles.btn, styles.rejectBtn]} onPress={onReject}>
              <Text testID="reject-btn-text" style={styles.whiteText}>
                {t('reject')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity testID="approve-btn" style={[styles.btn, styles.approveBtn]} onPress={onApprove}>
              <Text testID="approve-btn-text" style={styles.whiteText}>
                {t('approve')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    ...globalStyles.justifyContentCenter,
    ...globalStyles.alignItemsCenter,
    flex: 1,
    backgroundColor: colors.modalBg,
  },
  box: {
    width: 320,
    backgroundColor: colors.khaki,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  btnContainer: {
    ...globalStyles.justifyContentBetween,
    ...globalStyles.alignItemsCenter,
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  desc: {
    color: colors.grayLight,
    fontSize: 12,
    textAlign: 'center',
  },
  btn: {
    ...globalStyles.justifyContentCenter,
    ...globalStyles.alignItemsCenter,
    width: 120,
    paddingVertical: 8,
    borderRadius: 120 / 2,
  },
  rejectBtn: {
    backgroundColor: colors.red,
  },
  approveBtn: {
    backgroundColor: colors.green,
  },
  whiteText: {
    color: colors.white,
  },
});
