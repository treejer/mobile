import globalStyles from 'constants/styles';

import React, {useCallback, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {CommonActions, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {Tree} from 'components/Icons';
import {useConfig, useWalletAccount, useWeb3} from 'services/web3';
import {GreenBlockRouteParamList} from 'types';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {ContractType} from 'services/config';

interface Props {}

function AcceptInvitation(_: Props) {
  const {
    params: {greenBlockId},
  } = useRoute<RouteProp<GreenBlockRouteParamList, 'AcceptInvitation'>>();
  const [submiting, setSubmitting] = useState(false);
  const wallet = useWalletAccount();
  const web3 = useWeb3();
  const navigation = useNavigation();
  const config = useConfig();

  const handleJoinGreenBlock = useCallback(async () => {
    setSubmitting(true);
    try {
      const transaction = await sendTransactionWithGSN(config, ContractType.Planter, web3, wallet, 'joinGB', [
        greenBlockId,
      ]);

      console.log('transaction', transaction);

      Alert.alert('Success', 'You successfully joined this green block! Start planting!');

      navigation.dispatch(state =>
        CommonActions.reset({
          ...state,
          routes: [{name: 'MyCommunity'}],
          index: state.index,
          stale: state.stale as any,
        }),
      );
    } catch (error) {
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  }, [greenBlockId, web3, wallet, navigation]);

  return (
    <View
      style={[
        globalStyles.fill,
        globalStyles.safeArea,
        globalStyles.p1,
        globalStyles.pt3,
        globalStyles.alignItemsCenter,
        globalStyles.justifyContentCenter,
      ]}
    >
      <Spacer times={8} />
      <Text>You've been invited to this green block</Text>
      <Spacer times={8} />
      <Button
        variant="success"
        onPress={() => {
          handleJoinGreenBlock();
        }}
        icon={Tree}
        caption="Join"
        disabled={submiting}
        loading={submiting}
      />
    </View>
  );
}

export default AcceptInvitation;
