import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import {useNetInfo} from 'ranger-redux/modules/netInfo/netInfo';

export type SubmissionButtonsProps = {
  testID?: string;
  hasNoPermission?: boolean;
  isUpdate?: boolean;
  isSingle?: boolean;
  onGrant?: () => void;
  canDraft: boolean;
  canSubmit: boolean;
  onDraft: () => void;
  onSubmit: () => void;
  onPreview: () => void;
};

export function SubmissionButtons(props: SubmissionButtonsProps) {
  const {testID, canSubmit, canDraft, isSingle, isUpdate, hasNoPermission, onGrant, onSubmit, onDraft, onPreview} =
    props;

  const {isConnected} = useNetInfo();

  const {t} = useTranslation();

  const submissionType = useMemo(() => (isSingle ? 'Single' : 'Nursery'), [isSingle]);
  const actionType = useMemo(() => (isUpdate ? 'update' : 'plant'), [isUpdate]);

  return (
    <View testID={testID}>
      {hasNoPermission && onGrant ? (
        <TouchableOpacity testID="permission-btn" style={[styles.btn, styles.submitBtn]} onPress={onGrant}>
          <Text testID="permission-btn-text" style={styles.whiteText}>
            {t(`submitTreeV2.buttons.grantAll`)}
          </Text>
        </TouchableOpacity>
      ) : null}
      {canSubmit && !hasNoPermission ? (
        <TouchableOpacity testID="preview-submission" style={[styles.btn, styles.previewBtn]} onPress={onPreview}>
          <Text testID="preview-submission-text" style={styles.blackText}>
            {t(`submitTreeV2.buttons.preview${submissionType}`)}
          </Text>
        </TouchableOpacity>
      ) : null}
      {canDraft && !hasNoPermission ? (
        <TouchableOpacity testID="draft-submission" style={[styles.btn, styles.draftBtn]} onPress={onDraft}>
          <Text testID="draft-submission-text" style={styles.blackText}>
            {t(`submitTreeV2.buttons.draft${submissionType}`, {submissionType: t(actionType)})}
          </Text>
        </TouchableOpacity>
      ) : null}
      {canSubmit && !hasNoPermission ? (
        <TouchableOpacity testID="submit-submission" style={[styles.btn, styles.submitBtn]} onPress={onSubmit}>
          <Text testID="submit-submission-text" style={styles[isConnected ? 'whiteText' : 'decoratedText']}>
            {t(`submitTreeV2.buttons.${actionType + submissionType}`)}
          </Text>
          {!isConnected ? (
            <Text testID="submit-offline-text" style={styles.whiteText}>
              {t('submitTreeV2.buttons.offline')}
            </Text>
          ) : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    ...colors.smShadow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  previewBtn: {
    backgroundColor: colors.white,
  },
  draftBtn: {
    backgroundColor: colors.yellow,
  },
  submitBtn: {
    backgroundColor: colors.green,
  },
  blackText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  whiteText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  decoratedText: {
    position: 'absolute',
    top: 0,
    color: colors.white,
    textDecorationStyle: 'solid',
    textDecorationLine: 'line-through',
    textDecorationColor: colors.white,
    fontSize: 10,
    fontWeight: '300',
  },
});
