import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from 'components/Card';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {TreejerDaiCoin, StableDaiCoin} from '../../../assets/images';

export type TDaiCoinBalanceProps = {
  name: 'treejer' | 'stablecoin';
  basePrice: string | number;
  balance: string;
  description?: boolean;
  open?: boolean;
};

export function DaiCoinBalance(props: TDaiCoinBalanceProps) {
  const {name, balance, description, basePrice, open = true} = props;

  const {t} = useTranslation();

  return (
    <Card style={[globalStyles.alignItemsCenter, open ? styles.container : styles.containerSmall]}>
      <View>
        <Image
          style={open ? styles.imageStandard : styles.imageSmall}
          source={name === 'treejer' ? TreejerDaiCoin : StableDaiCoin}
        />
      </View>
      <View style={styles.details}>
        <View style={globalStyles.fill}>
          <Text style={open ? styles.coinName : styles.coinNameSmall}>{`${t('dai')} ${name}`}</Text>
          {description && <Text style={styles.description}>{t(`transfer.${name}Description`)}</Text>}
          {open && (
            <>
              <Spacer />
              <Text style={styles.mute}>${basePrice}</Text>
            </>
          )}
        </View>
        <View style={open ? styles.justifyBetween : [globalStyles.justifyContentCenter]}>
          {open && <Text style={styles.coinName}>{balance} DAI</Text>}
          <Text style={styles.mute}>${balance}</Text>
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
    heigh: 56,
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
    marginTop: -3,
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
