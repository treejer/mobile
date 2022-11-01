import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {AboutWithdraw} from 'components/Withdraw/AboutWithdraw';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import BN from 'bn.js';

import globalStyles from 'constants/styles';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {DaiCoinBalance} from 'components/Withdraw/DaiCoinBalance';
import {TTransactionHistory} from 'components/Withdraw/TransactionItem';
import {TContract} from 'ranger-redux/modules/contracts/contracts';

export type TWithdrawSectionProps = {
  history: TTransactionHistory[] | null;
  handleWithdraw: () => void;
  planterWithdrawableBalance: TContract | undefined;
  daiBalance: BN | string | number;
  redeeming: boolean;
  loading: boolean;
};

export function WithdrawSection(props: TWithdrawSectionProps) {
  const {planterWithdrawableBalance, daiBalance, redeeming, loading, history, handleWithdraw} = props;

  const {t} = useTranslation();

  return (
    <View style={globalStyles.alignItemsCenter}>
      {!planterWithdrawableBalance && !daiBalance ? !history?.length && <AboutWithdraw /> : null}
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
