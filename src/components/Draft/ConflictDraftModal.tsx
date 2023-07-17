import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export type ConflictDraftModalProps = {
  testID?: string;
  onCancel: () => void;
  onAccept: () => void;
};

export function ConflictDraftModal(props: ConflictDraftModalProps) {
  const {testID, onAccept, onCancel} = props;

  const {t} = useTranslation();

  return (
    <Modal testID={testID} style={styles.modal} transparent onRequestClose={onCancel}>
      <View style={styles.container}>
        <Card style={styles.box}>
          <Text testID="conflict-draft-title" style={styles.title}>
            {t('conflictDraftModal.title')}
          </Text>
          <Spacer />
          <Text testID="conflict-draft-message" style={styles.desc}>
            {t('conflictDraftModal.description')}
          </Text>
          <Spacer times={8} />
          <View style={styles.btnContainer}>
            <TouchableOpacity testID="cancel-btn" style={[styles.btn, styles.rejectBtn]} onPress={onCancel}>
              <Text testID="cancel-btn-text" style={styles.whiteText}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity testID="accept-btn" style={[styles.btn, styles.approveBtn]} onPress={onAccept}>
              <Text testID="approve-btn-text" style={styles.whiteText}>
                {t('accept')}
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
