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
import {upload, uploadContent, getHttpDownloadUrl} from 'utilities/helpers/IPFS';
import {sendTransaction} from 'utilities/helpers/sendTransaction';
import config from 'services/config';

interface Props {}

function SubmitTree(_: Props) {
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();
  const [photoHash, setPhotoHash] = useState<string>();
  const [metaDataHash, setMetaDataHash] = useState<string>();
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
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

    const photoUploadResult = await upload(journey.photo.uri);
    setPhotoHash(photoUploadResult.Hash);

    if (!journey.treeIdToUpdate) {
      const treeName = 'My Tree';

      const metaDataUploadResult = await uploadContent(
        JSON.stringify({
          name: treeName,
          description: `"${treeName}" photo submitted on ${new Date().toDateString()}`,
          image: getHttpDownloadUrl(photoUploadResult.Hash),
        }),
      );

      setMetaDataHash(metaDataUploadResult.Hash);
    }

    setIsReadyToSubmit(true);
  }, []);
  console.log(metaDataHash);

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      alert('Wallet not provided');
      return;
    }

    setSubmitting(true);

    let tx: any;
    let address: string;

    if (journey.treeIdToUpdate) {
      tx = updateFactory.methods.post(Number(journey.treeIdToUpdate), photoHash);
      address = config.contracts.UpdateFactory.address;
    } else {
      tx = treeFactory.methods.plant(
        0, // Type id
        [
          getHttpDownloadUrl(metaDataHash), // Metadata
          journey.location.latitude.toString(), // Lat
          journey.location.longitude.toString(), // Lon
        ],
        [
          '1', // Height
          '1', // Diameter
        ],
      );
      address = config.contracts.TreeFactory.address;
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
  }, [wallet, treeFactory, updateFactory, web3, journey, photoHash, metaDataHash]);

  useEffect(() => {
    handleUploadToIpfs();
  }, [handleUploadToIpfs]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />

        {isReadyToSubmit ? (
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
