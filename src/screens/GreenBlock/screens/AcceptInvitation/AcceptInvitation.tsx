import globalStyles from 'constants/styles';

import React, {useCallback, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {Tree} from 'components/Icons';
import {useGBFactory, useWalletAccount, useWeb3} from 'services/web3';
import {sendTransaction} from 'utilities/helpers/sendTransaction';
import config from 'services/config';
import {GreenBlockRouteParamList} from 'types';

interface Props {}

function AcceptInvitation(_: Props) {
  const {
    params: {greenBlockId},
  } = useRoute<RouteProp<GreenBlockRouteParamList, 'AcceptInvitation'>>();
  const [submiting, setSubmitting] = useState(false);
  const gbFactory = useGBFactory();
  const wallet = useWalletAccount();
  const web3 = useWeb3();

  const handleJoinGreenBlock = useCallback(async () => {
    setSubmitting(true);
    try {
      const tx = gbFactory.methods.joinGB(greenBlockId, wallet.address);

      const receipt = await sendTransaction(web3, tx, config.contracts.GBFactory.address, wallet);
      console.log('Receipt', receipt.transactionHash);
      Alert.alert('You successfully joined this green block! Start planting!');
    } catch (error) {
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  }, [gbFactory, greenBlockId, web3, wallet]);

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
        loading={submiting}
      />
    </View>
  );
}

export default AcceptInvitation;
