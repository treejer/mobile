import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {AboutWithdraw} from 'components/Withdraw/AboutWithdraw';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import BN from 'bn.js';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {DaiCoinBalance} from 'components/Withdraw/DaiCoinBalance';
import {TContract} from '../../../redux/modules/contracts/contracts';

export type TWithdrawSectionProps = {
  handleWithdraw: () => void;
  planterWithdrawableBalance: TContract | undefined;
  daiBalance: string | BN;
  redeeming: boolean;
  loading: boolean;
};

export function WithdrawSection(props: TWithdrawSectionProps) {
  const {planterWithdrawableBalance, daiBalance, redeeming, handleWithdraw, loading} = props;

  const {t} = useTranslation();

  return (
    <View style={globalStyles.alignItemsCenter}>
      {!planterWithdrawableBalance && !daiBalance && <AboutWithdraw />}
      <Spacer times={4} />
      <DaiCoinBalance
        name="treejer"
        description
        basePrice="1.00"
        balance={planterWithdrawableBalance}
        open={!!planterWithdrawableBalance}
        loading={loading}
      />
      <Spacer times={planterWithdrawableBalance ? 6 : undefined} />
      {!!planterWithdrawableBalance && (
        <>
          <Button
            style={globalStyles.alignItemsCenter}
            onPress={handleWithdraw}
            variant="secondary"
            loading={redeeming}
            caption={t('transfer.redeem')}
            icon={() => (!redeeming ? <Icon name="level-down-alt" color="#FFF" /> : null)}
          />
          <Spacer times={6} />
        </>
      )}
      <DaiCoinBalance
        name="stablecoin"
        description
        basePrice="1.00"
        balance={daiBalance}
        open={!!planterWithdrawableBalance || !!daiBalance}
        loading={loading}
      />
    </View>
  );
}
