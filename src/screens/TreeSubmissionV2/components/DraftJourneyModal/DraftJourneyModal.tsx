import React, {useMemo, useState} from 'react';
import {Modal, Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {capitalize} from 'utilities/helpers/capitalize';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

export type DraftJourneyModalProps = {
  testID?: string;
  isSingle: boolean;
  draftId: Date;
  draftType: DraftType;
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

export function DraftJourneyModal(props: DraftJourneyModalProps) {
  const {testID, draftType, draftId, isSingle, onCancel, onSubmit} = props;

  const [draftName, setDraftName] = useState('');

  const {locale} = useSettings();

  const {t} = useTranslation();

  const draftDefaultName = useMemo(
    () => `${capitalize(draftType)} ${moment(draftId).locale(locale.toLowerCase()).format('YYYY-MM-DD hh:mm:ss a')}`,
    [draftType, draftId],
  );

  return (
    <Modal testID={testID} style={styles.modal} transparent onRequestClose={onCancel}>
      <View style={styles.container}>
        <Card style={styles.box}>
          <Text testID="draft-title" style={styles.title}>
            {t('submitTreeV2.titles.draft', {submissionType: t(isSingle ? 'tree' : 'nursery')})}
          </Text>
          <Spacer times={6} />
          <TextInput
            testID="draft-input"
            style={styles.input}
            value={draftName}
            onChangeText={setDraftName}
            placeholder={draftDefaultName}
            placeholderTextColor={colors.placeholder}
          />
          <Spacer times={6} />
          <View style={styles.btnContainer}>
            <TouchableOpacity testID="cancel-btn" style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
              <Text testID="cancel-btn-text" style={styles.whiteText}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="submit-btn"
              style={[styles.btn, styles.submitBtn]}
              onPress={() => onSubmit(draftName || draftDefaultName)}
            >
              <Text testID="submit-btn-text" style={styles.whiteText}>
                {t('submit')}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBg,
  },
  box: {
    width: 320,
    height: 200,
    backgroundColor: colors.khaki,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whiteText: {
    color: colors.white,
  },
  btn: {
    ...globalStyles.justifyContentCenter,
    ...globalStyles.alignItemsCenter,
    width: 120,
    paddingVertical: 8,
    borderRadius: 120 / 2,
  },
  cancelBtn: {
    backgroundColor: colors.red,
  },
  submitBtn: {
    backgroundColor: colors.green,
  },
});
