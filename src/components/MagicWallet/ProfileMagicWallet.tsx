import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTranslation} from 'react-i18next';
import {colors} from 'constants/values';
import Card from 'components/Card';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import {useConfig, useWalletWeb3} from 'utilities/hooks/useWeb3';
import {isMatic} from 'services/Magic';
import {useContracts} from '../../redux/modules/contracts/contracts';

export type ProfileMagicWalletProps = {
  wallet: string;
};

export function ProfileMagicWallet(props: ProfileMagicWalletProps) {
  const {wallet} = props;

  const {dai, ether} = useContracts();

  const config = useConfig();

  const {t} = useTranslation();

  const handleCopyWalletAddress = useCallback(() => {
    if (wallet) {
      Clipboard.setString(wallet);
      showAlert({
        message: t('myProfile.copied'),
        mode: AlertMode.Success,
      });
    }
  }, [t, wallet]);

  return (
    <Card style={styles.container}>
      <View style={styles.walletWrapper}>
        <Text>{t('magicWallet.title')}</Text>
        <Spacer />
        <TouchableOpacity onPress={handleCopyWalletAddress}>
          <Text numberOfLines={1} style={styles.addressBox}>
            {wallet.slice(0, 15)}...
          </Text>
        </TouchableOpacity>
      </View>
      <Spacer times={4} />
      <View style={styles.walletWrapper}>
        <Text>{t('magicWallet.daiBalance')}</Text>
        <Spacer />
        <Text style={styles.balance}>{dai ? Number(dai).toFixed(8) : '...'}</Text>
      </View>
      <Spacer times={1} />
      <View style={styles.walletWrapper}>
        <Text>{t(isMatic(config) ? 'settings.maticBalance' : 'settings.ethBalance')}</Text>
        <Spacer />
        <Text style={styles.balance}>{ether ? Number(ether).toFixed(8) : '...'}</Text>
      </View>
      <Spacer times={4} />
      <Text>How to add this wallet to metamask?</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 300,
    paddingVertical: 12,
  },
  walletWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressBox: {
    backgroundColor: colors.khakiDark,
    textAlign: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gray,
    borderStyle: 'solid',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    ...globalStyles.tiny,
  },
  balance: {
    ...globalStyles.h6,
  },
});
