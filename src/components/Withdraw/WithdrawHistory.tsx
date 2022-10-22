import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {ActivityList} from 'components/Activity/ActivityList';
import {Hr} from 'components/Common/Hr';

export type TWithdrawHistory = {
  id: string | number;
  amount: string;
  date: Date | number | string;
  txHash: string;
};

export function WithdrawHistory() {
  const {t} = useTranslation();

  return (
    <View style={globalStyles.alignItemsCenter}>
      <View style={{width: 360}}>
        <Text style={styles.title}>{t('transfer.form.history')}</Text>
        <Spacer />
        <Hr />
      </View>
      <ActivityList filters={['sent', 'claimed']} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.grayDarker,
  },
});
