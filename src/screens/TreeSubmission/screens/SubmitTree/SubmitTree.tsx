import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, Text, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {TransactionReceipt} from 'web3-core';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useWalletAccount, useWalletWeb3} from 'services/web3';
import {getHttpDownloadUrl, upload, uploadContent} from 'utilities/helpers/IPFS';
import {TreeSubmissionRouteParamList} from 'types';
import config from 'services/config';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {Hex2Dec} from 'utilities/helpers/hex';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {currentTimestamp} from 'utilities/helpers/date';
import {useTranslation} from 'react-i18next';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import SubmitTreeModal from 'components/SubmitTreeModal/SubmitTreeModal';
import {TreeFilter} from 'components/TreeList/TreeList';

interface Props {
  navigation: any;
}

function SubmitTree(_: Props) {
  const navigation = useNavigation();

  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();

  const {t} = useTranslation();

  const [photoHash, setPhotoHash] = useState<string>();
  const [metaDataHash, setMetaDataHash] = useState<string>();
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const birthDay = currentTimestamp();

  const {sendEvent} = useAnalytics();

  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isAssignedTreeToPlant = typeof journey?.treeIdToPlant !== 'undefined';

  const web3 = useWalletWeb3();
  const wallet = useWalletAccount();

  const updatedTreeQuery = useQuery<TreeDetailQueryQueryData, TreeDetailQueryQueryData.Variables>(TreeDetailQuery, {
    skip: !isUpdate,
    variables: {
      // todo fix it
      id: journey?.treeIdToUpdate,
    },
  });
  const updateTreeData = updatedTreeQuery?.data?.tree;

  const assignedTreeQuery = useQuery<TreeDetailQueryQueryData, TreeDetailQueryQueryData.Variables>(TreeDetailQuery, {
    skip: !isAssignedTreeToPlant,
    variables: {
      // todo fix it
      id: journey?.treeIdToPlant,
    },
  });
  const assignedTreeData = assignedTreeQuery?.data?.tree;

  // const treeListQuery = useQuery<TreesQueryQueryData, TreesQueryQueryData.Variables>(TempTreeDetail, {
  //   variables: {
  //     address: wallet.address,
  //   },
  // });
  const handleUploadToIpfs = useCallback(async () => {
    console.log(journey.photo, '<====');
    if (!journey.photo || (!journey.location && !isUpdate)) {
      return;
    }

    if (
      isUpdate &&
      (updateTreeData?.treeSpecsEntity == null || typeof updateTreeData?.treeSpecsEntity === 'undefined')
    ) {
      Alert.alert(t('submitTree.treeSpecEmpty'));
      return;
    }

    if (isAssignedTreeToPlant && (assignedTreeData == null || typeof assignedTreeData === 'undefined')) {
      Alert.alert(t('submitTree.treeDataNotLoaded'));
      return;
    }

    const photoUploadResult = await upload(journey.photo?.path);
    setPhotoHash(photoUploadResult.Hash);

    console.log(journey, '====> journey <====');

    let jsonData;
    if (isUpdate) {
      const updateSpec = {
        image: getHttpDownloadUrl(photoUploadResult.Hash),
        image_hash: photoUploadResult.Hash,
        created_at: birthDay?.toString(),
      };

      const treeSpecJson = updateTreeData?.treeSpecsEntity;
      let updates;

      if (typeof treeSpecJson?.updates != 'undefined' && treeSpecJson?.updates != '') {
        updates = JSON.parse(treeSpecJson?.updates);
        updates.push(updateSpec);
      } else {
        updates = [updateSpec];
      }

      jsonData = {
        location: {
          latitude: updateTreeData?.treeSpecsEntity?.latitude?.toString(),
          longitude: updateTreeData?.treeSpecsEntity?.longitude?.toString(),
        },
        updates,
      };
      if (updateTreeData?.treeSpecsEntity?.name) {
        jsonData.name = updateTreeData?.treeSpecsEntity?.name;
      }
      if (updateTreeData?.treeSpecsEntity?.description) {
        jsonData.description = updateTreeData?.treeSpecsEntity?.description;
      }
      if (updateTreeData?.treeSpecsEntity?.externalUrl) {
        jsonData.external_url = updateTreeData?.treeSpecsEntity?.externalUrl;
      }
      if (updateTreeData?.treeSpecsEntity?.imageHash) {
        jsonData.image_ipfs_hash = updateTreeData?.treeSpecsEntity?.imageHash;
      }
      if (updateTreeData?.treeSpecsEntity?.symbolFs) {
        jsonData.symbol = updateTreeData?.treeSpecsEntity?.symbolFs;
      }
      if (updateTreeData?.treeSpecsEntity?.symbolHash) {
        jsonData.symbol_ipfs_hash = updateTreeData?.treeSpecsEntity?.symbolHash;
      }
      if (updateTreeData?.treeSpecsEntity?.animationUrl) {
        jsonData.animation_url = updateTreeData?.treeSpecsEntity?.animationUrl;
      }
      if (updateTreeData?.treeSpecsEntity?.diameter) {
        jsonData.diameter = updateTreeData?.treeSpecsEntity?.diameter;
      }
      if (updateTreeData?.treeSpecsEntity?.attributes) {
        jsonData.attributes = JSON.parse(updateTreeData?.treeSpecsEntity?.attributes);
      }

      if (treeSpecJson.nursery === 'true' && journey.location?.longitude && journey.location?.latitude) {
        jsonData.location = {
          latitude: Math.trunc(journey.location.latitude * Math.pow(10, 6))?.toString(),
          longitude: Math.trunc(journey.location.longitude * Math.pow(10, 6))?.toString(),
        };
        const prevLocation = {
          latitude: updateTreeData?.treeSpecsEntity?.latitude?.toString(),
          longitude: updateTreeData?.treeSpecsEntity?.longitude?.toString(),
        };
        jsonData.locations = treeSpecJson.locations?.length
          ? [...treeSpecJson.locations, prevLocation]
          : [prevLocation];
      }
    } else {
      // if(isAssignedTreeToPlant) {
      //   await setTimeout(() => {  console.log("World!"); }, 2000);
      // }
      console.log(isAssignedTreeToPlant, 'isAssignedTreeToPlant');
      console.log(assignedTreeData?.treeSpecsEntity, 'assignedTreeData?.treeSpecsEntity');

      if (isAssignedTreeToPlant && assignedTreeData?.treeSpecsEntity != null) {
        const updateSpec = {
          image: getHttpDownloadUrl(photoUploadResult.Hash),
          image_hash: photoUploadResult.Hash,
          created_at: birthDay?.toString(),
        };

        const treeSpecJson = assignedTreeData?.treeSpecsEntity;
        let updates;

        console.log(treeSpecJson?.updates, 'updates <=========');
        if (typeof treeSpecJson?.updates != 'undefined' && treeSpecJson?.updates != '') {
          updates = JSON.parse(treeSpecJson?.updates);
          updates.push(updateSpec);
        } else {
          updates = [updateSpec];
        }

        jsonData = {
          location: {
            latitude: Math.trunc(journey.location.latitude * Math.pow(10, 6))?.toString(),
            longitude: Math.trunc(journey.location.longitude * Math.pow(10, 6))?.toString(),
          },
          updates,
        };
        if (assignedTreeData?.treeSpecsEntity?.imageFs) {
          jsonData.image = assignedTreeData?.treeSpecsEntity?.imageFs?.toString();
        }
        if (assignedTreeData?.treeSpecsEntity?.image_ipfs_hash) {
          jsonData.image_ipfs_hash = assignedTreeData?.treeSpecsEntity?.image_ipfs_hash?.toString();
        }
      } else {
        jsonData = {
          location: {
            latitude: Math.trunc(journey.location.latitude * Math.pow(10, 6))?.toString(),
            longitude: Math.trunc(journey.location.longitude * Math.pow(10, 6))?.toString(),
          },
          updates: [
            {
              image: getHttpDownloadUrl(photoUploadResult.Hash),
              image_hash: photoUploadResult.Hash,
              created_at: birthDay?.toString(),
            },
          ],
        };
        if (journey.isSingle === false) {
          jsonData.nursery = 'true';
        }
      }
    }

    const metaDataUploadResult = await uploadContent(JSON.stringify(jsonData));

    console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

    setMetaDataHash(metaDataUploadResult.Hash);
    // }

    setIsReadyToSubmit(true);
  }, [journey, isUpdate, updateTreeData?.treeSpecsEntity, isAssignedTreeToPlant, assignedTreeData, t, birthDay]);

  const handleSendUpdateTransaction = useCallback(
    async (treeId: number) => {
      console.log(metaDataHash, '====> metaDataHash <====');
      console.log(treeId, '====> treeId <====');
      // console.log(Hex2Dec(treeId), '====> Hex2Dec(treeId) <====');
      // const tx = await treeFactory.methods.updateTree(treeId, metaDataHash);
      // const receipt = await sendTransactionWithWallet(web3, tx, config.contracts.TreeFactory.address, wallet);

      const receipt = await sendTransactionWithGSN(web3, wallet, config.contracts.TreeFactory, 'updateTree', [
        treeId,
        metaDataHash,
      ]);

      // const receipt = await sendTransactionWithGSN(web3, wallet, config.contracts.UpdateFactory, 'post', [
      //   treeId,
      //   photoHash,
      // ]);
      console.log(receipt, 'receipt');

      return receipt;
    },
    [metaDataHash, web3, wallet],
  );
  const handleSendCreateTransaction = useCallback(async () => {
    let receipt;
    if (typeof journey?.treeIdToPlant !== 'undefined') {
      console.log('here plant tree', Hex2Dec(journey.treeIdToPlant));
      // const tx = await treeFactory.methods.plantAssignedTree(Hex2Dec(journey.treeIdToPlant),metaDataHash, birthDay, 0);
      // receipt =  await sendTransactionWithWallet(web3, tx, config.contracts.TreeFactory.address, wallet);

      receipt = await sendTransactionWithGSN(web3, wallet, config.contracts.TreeFactory, 'plantAssignedTree', [
        Hex2Dec(journey.treeIdToPlant),
        metaDataHash,
        birthDay,
        0,
      ]);
    } else {
      receipt = await sendTransactionWithGSN(web3, wallet, config.contracts.TreeFactory, 'plantTree', [
        metaDataHash,
        birthDay,
        0,
      ]);
    }

    console.log(receipt, 'receipt');
    console.log(receipt.transactionHash, 'receipt.transactionHash');

    return receipt;
  }, [web3, wallet, journey, metaDataHash, birthDay]);

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      Alert.alert(t('submitTree.noWallet.title'), t('submitTree.noWallet.details'));

      return;
    }

    setSubmitting(true);

    let transaction: TransactionReceipt;
    try {
      if (journey.treeIdToUpdate) {
        sendEvent('update_tree_confirm');
        console.log(metaDataHash, '====> metaDataHash <====');
        transaction = await handleSendUpdateTransaction(Number(journey.treeIdToUpdate));
        // await treeListQuery.refetch();
        // await updatedTreeQuery.refetch();
        Alert.alert(t('success'), t('submitTree.updated'));
        navigation.reset({
          index: 0,
          routes: [{name: 'GreenBlock', params: {filter: TreeFilter.Temp}}],
        });
      } else {
        sendEvent('add_tree_confirm');
        transaction = await handleSendCreateTransaction();
        // await treeListQuery.refetch();
        // Alert.alert('Success', 'Your tree has been successfully submitted', [
        //   {
        //     text: 'OK',
        //     onPress: () => _.navigation.navigate('GreenBlock', {shouldNavigateToTreeDetails: true}),
        //   },

        Alert.alert(t('success'), t('submitTree.submitted'));
        navigation.reset({
          index: 0,
          routes: [{name: 'GreenBlock', params: {filter: TreeFilter.Temp}}],
        });
      }

      setTxHash(transaction.transactionHash);

      console.log('Transaction: ', transaction);
    } catch (error) {
      Alert.alert(t('submitTree.error'), t('submitTree.transactionFailed'));
      console.warn('Error', error);
    }
    setSubmitting(false);
  }, [
    wallet,
    t,
    journey.treeIdToUpdate,
    sendEvent,
    metaDataHash,
    handleSendUpdateTransaction,
    navigation,
    handleSendCreateTransaction,
  ]);

  useEffect(() => {
    if (
      (typeof journey.isSingle == 'undefined' || journey.isSingle === true || isAssignedTreeToPlant) &&
      !isReadyToSubmit
    ) {
      handleUploadToIpfs();
    }
  }, []);

  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';

  const contentMarkup = isReadyToSubmit ? (
    <TreeSubmissionStepper
      isUpdate={isUpdate}
      currentStep={4}
      isSingle={journey?.isSingle}
      count={journey?.nurseryCount}
      isNursery={isNursery}
    >
      <Spacer times={1} />

      {/* {txHash && <Text>Your transaction hash: {txHash}</Text>}*/}
      {!txHash && (
        <>
          <Text>{t('submitTree.confirm')}</Text>
          <Spacer times={4} />
          <Button
            variant="success"
            onPress={handleSignTransaction}
            caption={t('confirm')}
            loading={submitting}
            disabled={submitting}
          />
        </>
      )}
    </TreeSubmissionStepper>
  ) : (
    <TreeSubmissionStepper
      isUpdate={isUpdate}
      currentStep={3}
      isSingle={journey?.isSingle}
      count={journey?.nurseryCount}
      isNursery={isNursery}
    >
      <Spacer times={1} />
      <Text>{t('submitTree.photoUpdated')}</Text>

      <View style={{alignItems: 'center', justifyContent: 'center', padding: 15}}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    </TreeSubmissionStepper>
  );

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      {journey.isSingle === false && <SubmitTreeModal journey={journey} />}
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />
        {contentMarkup}
      </View>
    </ScrollView>
  );
}

export default SubmitTree;
