import React, {useMemo} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Web3 from 'web3';
import BN from 'bn.js';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {capitalize} from 'utilities/helpers/capitalize';
import {TreejerDaiCoin, StableDaiCoin} from '../../../assets/images';
import {TContract} from 'ranger-redux/modules/contracts/contracts';

export type TDaiCoinBalanceProps = {
  name: 'treejer' | 'stablecoin';
  basePrice: string | number;
  balance: TContract | BN | undefined;
  description?: boolean;
  open?: boolean;
  loading?: boolean;
};

export function DaiCoinBalance(props: TDaiCoinBalanceProps) {
  const {name, balance, description, basePrice, open = true, loading} = props;

  const {t} = useTranslation();

  const daiBalance = useMemo(() => Number(balance instanceof BN ? Web3.utils.fromWei(balance) : balance), [balance]);

  return (
    <Card style={[globalStyles.justifyContentCenter, open ? styles.container : styles.containerSmall]}>
      <View>
        <Image
          style={open ? styles.imageStandard : styles.imageSmall}
          source={name === 'treejer' ? TreejerDaiCoin : StableDaiCoin}
        />
      </View>
      <View style={styles.details}>
        <View style={globalStyles.fill}>
          <Text style={open ? styles.coinName : styles.coinNameSmall}>{`${t('dai')} ${capitalize(name)}`}</Text>
          {description && <Text style={styles.description}>{t(`transfer.${name}Description`)}</Text>}
          {open && (
            <>
              <Spacer />
              <Text style={styles.mute}>${basePrice}</Text>
            </>
          )}
        </View>
        <View style={open ? styles.justifyBetween : [globalStyles.justifyContentCenter]}>
          {open && (
            <Text style={styles.coinName}>{loading ? '...' : `${daiBalance.toFixed(daiBalance ? 6 : 0)} DAI`}</Text>
          )}
          <Text style={styles.mute}>{loading ? '...' : `$${daiBalance.toFixed(daiBalance ? 6 : 0)}`}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    paddingHorizontal: 8,
    paddingVertical: 14,
    flexDirection: 'row',
  },
  containerSmall: {
    width: 360,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  imageSmall: {
    width: 32,
    height: 32,
  },
  imageStandard: {
    width: 56,
    height: 56,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
  },
  coinNameSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  description: {
    marginTop: -2,
    fontSize: 10,
    color: colors.grayLight,
  },
  justifyBetween: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mute: {
    fontSize: 12,
    color: colors.gray,
  },
});
