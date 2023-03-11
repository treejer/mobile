import React, {useCallback, useMemo} from 'react';
import {useToast} from 'react-native-toast-notifications';
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
import {AlertMode} from 'utilities/helpers/alert';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {useContracts} from 'ranger-redux/modules/contracts/contracts';

export type ProfileMagicWalletProps = {
  wallet: string;
};

export function ProfileMagicWallet(props: ProfileMagicWalletProps) {
  const {wallet} = props;

  const {dai, ether, loading} = useContracts();
  const config = useConfig();

  const {t} = useTranslation();
  const toast = useToast();

  const daiBalance = useMemo(() => Web3.utils.fromWei(dai as string), [dai]);
  const etherBalance = useMemo(() => Web3.utils.fromWei(ether as string), [ether]);

  const handleCopyWalletAddress = useCallback(() => {
    if (wallet) {
      Clipboard.setString(wallet);
      toast.show('myProfile.copied', {type: AlertMode.Success, translate: true});
    }
  }, [toast, wallet]);

  return (
    <Card style={styles.container}>
      <View style={styles.walletWrapper}>
        <Text style={globalStyles.h5}>{t('magicWallet.title')}</Text>
        <Spacer />
        <TouchableOpacity onPress={handleCopyWalletAddress}>
          <Text numberOfLines={1} style={styles.addressBox}>
            {shortenedString(wallet, 20, 8)}
          </Text>
        </TouchableOpacity>
      </View>
      <Spacer times={4} />
      <View style={styles.walletWrapper}>
        <Text>{t('magicWallet.daiBalance')}</Text>
        <Spacer />
        <Text style={styles.balance}>{loading || !dai ? '...' : Number(daiBalance).toFixed(+dai ? 6 : 0)}</Text>
      </View>
      <Spacer times={1} />
      <View style={styles.walletWrapper}>
        <Text>{t(isMatic(config) ? 'settings.maticBalance' : 'settings.ethBalance')}</Text>
        <Spacer />
        <Text style={styles.balance}>{loading || !ether ? '...' : Number(etherBalance).toFixed(+ether ? 6 : 0)}</Text>
      </View>
      {/*<Spacer times={4} />*/}
      {/*<Text>How to add this wallet to metamask?</Text>*/}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
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
