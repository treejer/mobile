import React from 'react';
import {AboutWithdraw} from 'components/Transfer/AboutWithdraw';
import Spacer from 'components/Spacer';
import {DaiCoinBalance} from 'components/Transfer/DaiCoinBalance';
import Button from 'components/Button';
import globalStyles from 'constants/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TContract} from '../../../redux/modules/contracts/contracts';

export type TWithdrawSectionProps = {
  handleWithdraw: () => void;
  planterWithdrawableBalance: TContract | undefined;
  dai: TContract | undefined;
  submitting: boolean;
};

export function WithdrawSection(props: TWithdrawSectionProps) {
  const {planterWithdrawableBalance, dai, submitting, handleWithdraw} = props;

  const {t} = useTranslation();

  return (
    <View>
      {!planterWithdrawableBalance && !dai && <AboutWithdraw />}
      <Spacer times={4} />
      <DaiCoinBalance
        name="treejer"
        description
        basePrice="1.00"
        balance={planterWithdrawableBalance}
        open={!!planterWithdrawableBalance}
      />
      <Spacer times={planterWithdrawableBalance ? 6 : undefined} />
      {!!planterWithdrawableBalance && (
        <>
          <Button
            style={globalStyles.alignItemsCenter}
            onPress={handleWithdraw}
            variant="secondary"
            loading={submitting}
            caption={t('transfer.redeem')}
            icon={() => (submitting ? null : <Icon name="level-down-alt" color="#FFF" />)}
          />
          <Spacer times={6} />
        </>
      )}
      <DaiCoinBalance
        name="stablecoin"
        description
        basePrice="1.00"
        balance={dai}
        open={!!planterWithdrawableBalance || !!dai}
      />
    </View>
  );
}
