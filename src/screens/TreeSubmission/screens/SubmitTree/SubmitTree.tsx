import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Text, View, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {CommonActions, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import {TransactionReceipt} from 'web3-core';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useWeb3} from 'services/web3';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {upload, uploadContent, getHttpDownloadUrl} from 'utilities/helpers/IPFS';
import {TreeSubmissionRouteParamList} from 'types';
import {TreeJourney} from 'screens/TreeSubmission/types';
import config from 'services/config';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import TreeDetailsQuery, {
  TreeDetailsQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailsQuery.graphql';
import {TreesQueryQueryData} from 'screens/GreenBlock/screens/MyCommunity/graphql/TreesQuery.graphql';

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

  const wallet = useMemo(() => {
    return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
  }, [web3]);

  const updatedTreeQuery = useQuery<TreeDetailsQueryQueryData, TreeDetailsQueryQueryData.Variables>(TreeDetailsQuery, {
    skip: !isUpdate,
    variables: {
      id: Number(journey.treeIdToUpdate ?? 0),
    },
  });
  const treeListQuery = useQuery<TreesQueryQueryData, TreesQueryQueryData.Variables>(TreeDetailsQuery, {
    variables: {
      address: wallet.address,
    },
  });

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
    async (treeId: number) => {
      const receipt = await sendTransactionWithGSN(web3, wallet, config.contracts.UpdateFactory, 'post', [
        treeId,
        photoHash,
      ]);
      console.log(receipt.transactionHash);

      return receipt;
    },
    [photoHash, web3, wallet],
  );

  const handleSendCreateTransaction = useCallback(
    async (location: TreeJourney['location']) => {
      const receipt = await sendTransactionWithGSN(web3, wallet, config.contracts.TreeFactory, 'plant', [
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
      ]);
      console.log(receipt.transactionHash);

      return receipt;
    },
    [web3, wallet, metaDataHash],
  );

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      Alert.alert('No wallet', 'Wallet not provided');
      return;
    }

    setSubmitting(true);

    let transaction: TransactionReceipt;
    try {
      if (journey.treeIdToUpdate) {
        transaction = await handleSendUpdateTransaction(Number(journey.treeIdToUpdate));
        await treeListQuery.refetch();
        await updatedTreeQuery.refetch();
        Alert.alert('Success', 'The tree has been successfully updated');

        navigation.dangerouslyGetParent().dispatch(state => {
          const indexToGo = state.routes.findIndex(({name}) => name === 'TreeDetails');
          return CommonActions.reset({
            ...state,
            routes: state.routes.slice(0, indexToGo + 1),
            index: indexToGo,
            stale: state.stale as any,
          });
        });
      } else {
        transaction = await handleSendCreateTransaction(journey.location);
        await treeListQuery.refetch();
        Alert.alert('Success', 'Your tree has been successfully submitted');

        navigation.dispatch(state =>
          CommonActions.reset({
            ...state,
            routes: [{name: 'SelectPhoto', params: {}}],
            index: 0,
            stale: state.stale as any,
          }),
        );
      }

      setTxHash(transaction.transactionHash);

      console.log('Transaction: ', transaction);
    } catch (error) {
      Alert.alert('Error occurred', "Transaction couldn't be completed");
      console.warn('Error', error);
    }
    setSubmitting(false);
  }, [
    wallet,
    journey,
    navigation,
    handleSendCreateTransaction,
    handleSendUpdateTransaction,
    updatedTreeQuery,
    treeListQuery,
  ]);

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
