import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useTreeFactory, useUpdateFactory, useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionRouteParamList} from 'screens/TreeSubmission/TreeSubmission';
import {upload} from 'utilities/helpers/IPFS';
import {sendTransaction} from 'utilities/helpers/sendTransaction';

interface Props {}

function SubmitTree(_: Props) {
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();
  const [photoHash, setPhotoHash] = useState<string>();
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';

  const web3 = useWeb3();
  const treeFactory = useTreeFactory();
  const updateFactory = useUpdateFactory();

  const wallet = useMemo(() => {
    return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
  }, [web3]);

  const handleUploadToIpfs = useCallback(async () => {
    if (!journey.photo || (!journey.location && !isUpdate)) {
      return;
    }

    const result = await upload(journey.photo.uri);

    setPhotoHash(result.Hash);
  }, []);

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      alert('Wallet not provided');
      return;
    }

    setSubmitting(true);

    let tx: any;
    let address: string;
    console.log(journey.treeIdToUpdate, photoHash);

    if (journey.treeIdToUpdate) {
      tx = updateFactory.methods.post(Number(journey.treeIdToUpdate), photoHash);
      address = updateFactory.options.address;
    } else {
      tx = treeFactory.methods.plant(
        0,
        3,
        ['My Tree', journey.location.latitude.toString(), journey.location.longitude.toString()],
        ['1', '1'],
      );
      address = treeFactory.options.address;
    }

    try {
      const receipt = await sendTransaction(web3, tx, address, wallet);
      setTxHash(receipt.transactionHash);

      console.log(`Transaction hash: ${receipt.transactionHash}`);
    } catch (error) {
      Alert.alert('Error occured', "Transaction couldn't complete");
      console.log(error);
    }

    setSubmitting(false);
  }, [wallet, treeFactory, updateFactory, web3, journey, photoHash]);

  useEffect(() => {
    handleUploadToIpfs();
  }, [handleUploadToIpfs]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />
        <Text style={[globalStyles.h5, globalStyles.textCenter]}>Submit a new tree</Text>
        <Spacer times={10} />

        {photoHash ? (
          <TreeSubmissionStepper isUpdate={isUpdate} currentStep={4}>
            <Spacer times={1} />

            {txHash ? (
              <Text>Your transaction hash: {txHash}</Text>
            ) : (
              <>
                <Text>Please confirm to plant the tree</Text>
                <Spacer times={4} />
                <Button
                  variant="success"
                  onPress={handleSignTransaction}
                  caption="Confirm"
                  loading={submitting}
                  disabled={submitting}
                />
              </>
            )}
          </TreeSubmissionStepper>
        ) : (
          <TreeSubmissionStepper isUpdate={isUpdate} currentStep={3}>
            <Spacer times={1} />
            <Text>Your photo is being uploaded</Text>

            <View style={{alignItems: 'center', justifyContent: 'center', padding: 15}}>
              <ActivityIndicator size="large" color={colors.green} />
            </View>
          </TreeSubmissionStepper>
        )}
      </View>
    </ScrollView>
  );
}

export default SubmitTree;
