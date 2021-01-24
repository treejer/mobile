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

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      Alert.alert('No wallet', 'Wallet not provided');
      return;
    }

    setSubmitting(true);

    let tx: any;
    let address: string;

    if (journey.treeIdToUpdate) {
      tx = updateFactory.methods.post(Number(journey.treeIdToUpdate), photoHash);
      address = config.contracts.UpdateFactory.address;

      try {
        const receipt = await sendTransaction(web3, tx, address, wallet);
        setTxHash(receipt.transactionHash);

        console.log(`Transaction hash: ${receipt.transactionHash}`);
      } catch (error) {
        Alert.alert('Error occured', "Transaction couldn't complete");
        console.warn('Error', error);
      }
    } else {
      try {
        const gsnProvider = await RelayProvider.newProvider({
          provider: web3.currentProvider as any,
          config: {
            auditorsCount: config.isMainnet ? 1 : 0,
            paymasterAddress: config.contracts.Paymaster.address,
          },
        }).init();
        gsnProvider.addAccount(wallet.privateKey);

        const web3GSN = new Web3(gsnProvider);
        const treeContract = new web3GSN.eth.Contract(
          config.contracts.TreeFactory.abi,
          config.contracts.TreeFactory.address,
        );

        // Sends the transaction via the GSN
        const transaction = await treeContract.methods
          .plant(
            // Type id
            0,
            [
              // Metadata
              getHttpDownloadUrl(metaDataHash),
              // Lat
              journey.location.latitude.toString(),
              // Lon
              journey.location.longitude.toString(),
            ],
            [
              // Height
              '1',
              // Diameter
              '1',
            ],
          )
          .send({from: wallet.address});

        console.log(transaction.hash);

        Alert.alert('Tree Submitted Successfully!');
      } catch (error) {
        Alert.alert('Error occurred', "Transaction couldn't complete");
        console.warn('Error', error);
      }
    }

    // navigation.navigate('MyCommunity');

    setSubmitting(false);
  }, [wallet, treeFactory, updateFactory, web3, journey, photoHash, metaDataHash]);

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
