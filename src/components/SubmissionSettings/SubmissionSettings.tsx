import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, Switch, Text, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import {isMatic} from 'services/Magic';
import Spacer from 'components/Spacer';
import Card from 'components/Card';
import {useConfig, useWalletWeb3} from 'ranger-redux/modules/web3/web3';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useContracts} from 'ranger-redux/modules/contracts/contracts';

export type SubmissionSettingsProps = {
  testID?: string;
  cardStyle?: ViewStyle;
  shadow?: boolean;
};

export function SubmissionSettings(props: SubmissionSettingsProps) {
  const {testID, cardStyle, shadow = true} = props;

  const config = useConfig();
  const {ether} = useContracts();
  const web3 = useWalletWeb3();

  const {useBiconomy, checkMetaData, changeUseBiconomy, changeCheckMetaData} = useSettings();
  const {t} = useTranslation();

  const etherBalance = useMemo(() => web3.utils.fromWei(ether as string), [ether]);

  const handleChangeUseBiconomy = value => {
    changeUseBiconomy(value);
  };

  return (
    <Card style={cardStyle} testID={testID} shadow={shadow}>
      {config.useV1Submission ? (
        <>
          <View style={styles.settingsItem}>
            <Text testID="use-biconomy" style={styles.text}>
              {t('settings.useBiconomy')}
            </Text>
            <Switch testID="transaction-switch" value={useBiconomy} onValueChange={handleChangeUseBiconomy} />
          </View>
          <View style={{paddingVertical: 16}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon name="note" size={20} style={{marginVertical: 2}} color={colors.red} />
              <Text testID="biconomy-detail" style={{textAlign: 'justify', paddingHorizontal: 8, color: colors.red}}>
                {t('settings.gsnDetails')}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8}}
          >
            <Text testID="network-balance-label" style={styles.text}>
              {t(isMatic(config) ? 'settings.maticBalance' : 'settings.ethBalance')}
            </Text>
            {etherBalance ? (
              <Text style={styles.text} testID="network-balance">
                {Number(etherBalance).toFixed(etherBalance ? 7 : 0)}
              </Text>
            ) : (
              <ActivityIndicator color={colors.gray} />
            )}
          </View>
          <Spacer />
        </>
      ) : null}
      {!config.isMainnet && (
        <>
          <View style={styles.settingsItem}>
            <Text testID="check-meta-data-label" style={styles.text}>
              {t('settings.checkMetaData')}
            </Text>
            <Switch testID="check-meta-data-switch" value={checkMetaData} onValueChange={changeCheckMetaData} />
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: colors.grayDarker,
  },
});
