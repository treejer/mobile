import React, {Fragment, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export type TWithdrawHistory = {
  id: string | number;
  amount: string;
  date: Date | number | string;
  txHash: string;
};

export type TWithdrawHistoryProps = {
  withdrawHistory: TWithdrawHistory[];
};

export function WithdrawHistory(props: TWithdrawHistoryProps) {
  const {withdrawHistory} = props;

  const {t} = useTranslation();

  const headers = useMemo(() => {
    return [
      {title: 'id', text: t('transfer.id')},
      {title: 'amount', text: t('transfer.form.amount')},
      {title: 'date', text: t('transfer.date')},
      {title: 'txHash', text: t('transfer.txHash')},
    ];
  }, [t]);

  return (
    <Card style={styles.container}>
      <View>
        <Text style={styles.title}>{t('transfer.withdrawHistory')}</Text>
      </View>
      <View style={styles.hr} />
      <View style={styles.row}>
        {headers.map(header => (
          <Fragment key={header.title}>
            <View style={header.title === 'id' ? globalStyles.fill : styles.header}>
              <Text style={styles.headerTxt}>{header.text}</Text>
            </View>
          </Fragment>
        ))}
      </View>
      <Spacer />
      <View>
        {withdrawHistory.map((withdrawAction, index) => {
          return (
            <Fragment key={withdrawAction.id}>
              <View style={[styles.row]}>
                <View style={globalStyles.fill}>
                  <Text style={[styles.valueTxt, {paddingLeft: 2}]}>{withdrawAction.id}</Text>
                </View>
                <View style={styles.value}>
                  <Text style={styles.valueTxt}>{withdrawAction.amount}</Text>
                </View>
                <View style={styles.value}>
                  <Text style={styles.valueTxt}>{withdrawAction.date}</Text>
                </View>
                <View style={styles.value}>
                  <Text style={styles.valueTxt}>{withdrawAction.txHash.slice(0, 15)}...</Text>
                </View>
              </View>
              {index !== withdrawHistory.length - 1 && <Spacer times={4} />}
            </Fragment>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  hr: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {alignItems: 'center', flex: 3},
  headerTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  value: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  valueTxt: {
    fontSize: 10,
    fontWeight: '300',
    color: colors.grayLight,
  },
});
