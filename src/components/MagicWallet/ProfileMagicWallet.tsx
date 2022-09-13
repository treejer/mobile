import React, {useCallback, useMemo} from 'react';
import {useToast} from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome';
import Web3 from 'web3';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';

import {isMatic} from 'services/Magic';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {shortenedString} from 'utilities/helpers/shortenedString';
import {useConfig} from 'utilities/hooks/useWeb3';
import {AlertMode} from 'utilities/helpers/alert';
import {useContracts} from '../../redux/modules/contracts/contracts';

export type ProfileMagicWalletProps = {
  wallet: string;
};

export function ProfileMagicWallet(props: ProfileMagicWalletProps) {
  const {wallet} = props;

  const {dai, ether, loading} = useContracts();
  const config = useConfig();

  const {t} = useTranslation();
  const toast = useToast();

  const daiBalance = useMemo(() => Web3.utils.fromWei(dai), [dai]);
  const etherBalance = useMemo(() => Web3.utils.fromWei(ether), [ether]);

  const handleCopyWalletAddress = useCallback(() => {
    if (wallet) {
      Clipboard.setString(wallet);
      // showAlert({
      //   message: t('myProfile.copied'),
      //   mode: AlertMode.Success,
      // });
      toast.show(t('myProfile.copied'), {
        type: AlertMode.Success,
        icon: <Icon name="tree" size={20} color={colors.white} />,
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
            {shortenedString(wallet, 25, 15)}
          </Text>
        </TouchableOpacity>
      </View>
      <Spacer times={4} />
      <View style={styles.walletWrapper}>
        <Text>{t('magicWallet.daiBalance')}</Text>
        <Spacer />
        <Text style={styles.balance}>{loading || !dai ? '...' : Number(daiBalance).toFixed(8)}</Text>
      </View>
      <Spacer times={1} />
      <View style={styles.walletWrapper}>
        <Text>{t(isMatic(config) ? 'settings.maticBalance' : 'settings.ethBalance')}</Text>
        <Spacer />
        <Text style={styles.balance}>{loading || !dai ? '...' : Number(etherBalance).toFixed(8)}</Text>
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
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
    ...globalStyles.tiny,
  },
  balance: {
    ...globalStyles.h6,
  },
});
