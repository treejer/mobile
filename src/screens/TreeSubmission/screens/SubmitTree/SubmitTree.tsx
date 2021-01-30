import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useTreeFactory, useUpdateFactory, useWeb3} from 'services/web3';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {upload, uploadContent, getHttpDownloadUrl} from 'utilities/helpers/IPFS';
import {sendTransaction} from 'utilities/helpers/sendTransaction';
import config from 'services/config';
import {TreeSubmissionRouteParamList} from 'types';
import {RelayProvider} from '@opengsn/gsn';
import Web3 from 'web3';
import {TreeJourney} from 'screens/TreeSubmission/types';

interface Props {}

function SubmitTree(_: Props) {
  const navigation = useNavigation();

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
  }, [isUpdate, journey.photo, journey.location, journey.treeIdToUpdate]);

  const handleSendUpdateTransaction = useCallback(
    (treeId: number) => {
      return updateFactory.methods.post(treeId, photoHash).send({from: wallet.address, gas: 1e6});
    },
    [updateFactory, wallet.address, photoHash],
  );

  const handleSendCreateTransaction = useCallback(
    (location: TreeJourney['location']) => {
      // Sends the transaction via the GSN
      return treeFactory.methods
        .plant(
          // Type id
          0,
          [
            // Metadata
            getHttpDownloadUrl(metaDataHash),
            // Lat
            location.latitude.toString(),
            // Lon
            location.longitude.toString(),
          ],
          [
            // Height
            '1',
            // Diameter
            '1',
          ],
        )
        .send({from: wallet.address, gas: 1e6});
    },
    [wallet, treeFactory, metaDataHash],
  );

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      Alert.alert('No wallet', 'Wallet not provided');
      return;
    }

    setSubmitting(true);

    let transaction: any;
    try {
      if (journey.treeIdToUpdate) {
        transaction = await handleSendUpdateTransaction(Number(journey.treeIdToUpdate));
        Alert.alert('Success', 'Your tree has been successfully updated');
      } else {
        transaction = await handleSendCreateTransaction(journey.location);
        Alert.alert('Success', 'Your tree has been successfully submitted');
      }

      setTxHash(transaction.hash);

      console.log('Transaction: ', transaction);

      navigation.navigate('GreenBlock', {});
    } catch (error) {
      Alert.alert('Error occurred', "Transaction couldn't complete");
      console.warn('Error', error);
    }
    setSubmitting(false);
  }, [wallet, journey, navigation, handleSendCreateTransaction, handleSendUpdateTransaction]);

  useEffect(() => {
    handleUploadToIpfs();
  }, [handleUploadToIpfs]);

  const contentMarkup = isReadyToSubmit ? (
    <TreeSubmissionStepper isUpdate={isUpdate} currentStep={4}>
      <Spacer times={1} />

      {txHash && <Text>Your transaction hash: {txHash}</Text>}
      {!txHash && (
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
  );

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />

        {contentMarkup}
      </View>
    </ScrollView>
  );
}

export default SubmitTree;
