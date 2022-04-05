import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {TransactionReceipt} from 'web3-core';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useConfig, useWalletAccount, useWalletWeb3} from 'services/web3';
import {upload, uploadContent} from 'utilities/helpers/IPFS';
import {TreeSubmissionRouteParamList} from 'types';
import {ContractType} from 'services/config';
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
import {useSettings} from 'services/settings';
import {assignedTreeJSON, canUpdateTreeLocation, newTreeJSON, updateTreeJSON} from 'utilities/helpers/submitTree';
import {Routes} from 'navigation';
import {TreeSubmissionStackNavigationProp} from 'screens/TreeSubmission/TreeSubmission';
import {AlertMode, showAlert} from 'utilities/helpers/alert';

interface Props {
  navigation: TreeSubmissionStackNavigationProp<Routes.SubmitTree>;
}

function SubmitTree(props: Props) {
  const {navigation} = props;

  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();

  const {t} = useTranslation();

  const {useGSN} = useSettings();

  const [photoHash, setPhotoHash] = useState<string>();
  const [metaDataHash, setMetaDataHash] = useState<string>();
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const config = useConfig();

  const birthDay = currentTimestamp();

  const {sendEvent} = useAnalytics();

  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isAssignedTreeToPlant = typeof journey?.treeIdToPlant !== 'undefined';

  const web3 = useWalletWeb3();
  const wallet = useWalletAccount();

  const updatedTreeQuery = useQuery<TreeDetailQueryQueryData, TreeDetailQueryQueryData.Variables>(TreeDetailQuery, {
    skip: !isUpdate,
    variables: journey?.treeIdToUpdate ? {id: journey.treeIdToUpdate} : undefined,
  });
  const updateTreeData = updatedTreeQuery?.data?.tree;

  const assignedTreeQuery = useQuery<TreeDetailQueryQueryData, TreeDetailQueryQueryData.Variables>(TreeDetailQuery, {
    skip: !isAssignedTreeToPlant,
    variables: journey?.treeIdToPlant ? {id: journey?.treeIdToPlant} : undefined,
  });
  const assignedTreeData = assignedTreeQuery?.data?.tree;

  // const treeListQuery = useQuery<TreesQueryQueryData, TreesQueryQueryData.Variables>(TempTreeDetail, {
  //   variables: {
  //     address: wallet.address,
  //   },
  // });
  const handleUploadToIpfs = useCallback(async () => {
    console.log(journey.photo, '<====');
    if (
      isUpdate &&
      (updateTreeData?.treeSpecsEntity == null || typeof updateTreeData?.treeSpecsEntity === 'undefined')
    ) {
      showAlert({
        message: t('submitTree.treeSpecEmpty'),
        mode: AlertMode.Error,
      });
      return;
    }

    if (isAssignedTreeToPlant && (assignedTreeData == null || typeof assignedTreeData === 'undefined')) {
      showAlert({
        message: t('submitTree.treeDataNotLoaded'),
        mode: AlertMode.Error,
      });
      return;
    }

    if (!journey.photo) {
      return;
    }

    try {
      const photoUploadResult = await upload(config.ipfsPostURL, journey.photo?.path);
      setPhotoHash(photoUploadResult.Hash);

      console.log(journey, '====> journey <====');

      let jsonData;
      if (isUpdate) {
        jsonData = updateTreeJSON(config.ipfsGetURL, {
          journey,
          tree: updateTreeData as TreeDetailQueryQueryData.Tree,
          photoUploadHash: photoUploadResult.Hash,
        });
      } else {
        console.log(isAssignedTreeToPlant, 'isAssignedTreeToPlant');
        console.log(assignedTreeData?.treeSpecsEntity, 'assignedTreeData?.treeSpecsEntity');

        if (isAssignedTreeToPlant && assignedTreeData?.treeSpecsEntity != null) {
          jsonData = assignedTreeJSON(config.ipfsGetURL, {
            journey,
            tree: assignedTreeData,
            photoUploadHash: photoUploadResult.Hash,
          });
        } else {
          jsonData = newTreeJSON(config.ipfsGetURL, {
            journey,
            photoUploadHash: photoUploadResult.Hash,
          });
        }
      }

      const metaDataUploadResult = await uploadContent(config.ipfsPostURL, JSON.stringify(jsonData));

      console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

      setMetaDataHash(metaDataUploadResult.Hash);
      // }

      setIsReadyToSubmit(true);
    } catch (e: any) {
      showAlert({
        message: e?.message || t('tryAgain'),
        mode: AlertMode.Error,
      });
    }
  }, [
    journey,
    isUpdate,
    updateTreeData,
    isAssignedTreeToPlant,
    assignedTreeData,
    t,
    config.ipfsPostURL,
    config.ipfsGetURL,
  ]);

  const handleSendUpdateTransaction = useCallback(
    async (treeId: number) => {
      console.log(metaDataHash, '====> metaDataHash <====');
      console.log(treeId, '====> treeId <====');

      const receipt = await sendTransactionWithGSN(
        config,
        ContractType.TreeFactory,
        web3,
        wallet,
        'updateTree',
        [treeId, metaDataHash],
        useGSN,
      );

      console.log(receipt, 'receipt');

      return receipt;
    },
    [metaDataHash, config, web3, wallet, useGSN],
  );
  const handleSendCreateTransaction = useCallback(async () => {
    let receipt;
    if (typeof journey?.treeIdToPlant !== 'undefined') {
      console.log('here plant tree', Hex2Dec(journey.treeIdToPlant));
      // const tx = await treeFactory.methods.plantAssignedTree(Hex2Dec(journey.treeIdToPlant),metaDataHash, birthDay, 0);
      // receipt =  await sendTransactionWithWallet(web3, tx, config.contracts.TreeFactory.address, wallet);

      receipt = await sendTransactionWithGSN(
        config,
        ContractType.TreeFactory,
        web3,
        wallet,
        'plantAssignedTree',
        [Hex2Dec(journey.treeIdToPlant), metaDataHash, birthDay, 0],
        useGSN,
      );
    } else {
      receipt = await sendTransactionWithGSN(
        config,
        ContractType.TreeFactory,
        web3,
        wallet,
        'plantTree',
        [metaDataHash, birthDay, 0],
        useGSN,
      );
    }

    console.log(receipt, 'receipt');
    console.log(receipt.transactionHash, 'receipt.transactionHash');

    return receipt;
  }, [journey.treeIdToPlant, config, web3, wallet, metaDataHash, birthDay, useGSN]);

  const handleSignTransaction = useCallback(async () => {
    if (!wallet) {
      showAlert({
        title: t('submitTree.noWallet.title'),
        message: t('submitTree.noWallet.details'),
        mode: AlertMode.Error,
      });

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
        showAlert({
          title: t('success'),
          message: t('submitTree.updated'),
          mode: AlertMode.Success,
        });
        navigation.reset({
          index: 0,
          routes: [{name: Routes.GreenBlock, params: {filter: TreeFilter.Temp}}],
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

        showAlert({
          title: t('success'),
          message: t('submitTree.submitted'),
          mode: AlertMode.Success,
        });
        navigation.reset({
          index: 0,
          routes: [{name: Routes.GreenBlock, params: {filter: TreeFilter.Temp}}],
        });
      }

      setTxHash(transaction.transactionHash);

      console.log('Transaction: ', transaction);
    } catch (error) {
      showAlert({
        title: t('submitTree.error'),
        message: t('submitTree.transactionFailed'),
        mode: AlertMode.Error,
      });
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
    (async function () {
      if (
        ((typeof journey.isSingle == 'undefined' || journey.isSingle === true || isAssignedTreeToPlant) &&
          !isReadyToSubmit) ||
        !journey.photo ||
        (!journey.location && !isUpdate)
      ) {
        await handleUploadToIpfs();
      }
    })();
  }, []);

  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
  const canUpdate = canUpdateTreeLocation(journey, isNursery);

  const contentMarkup = isReadyToSubmit ? (
    <TreeSubmissionStepper
      isUpdate={isUpdate}
      currentStep={4}
      isSingle={journey?.isSingle}
      count={journey?.nurseryCount}
      canUpdateLocation={canUpdate}
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
      canUpdateLocation={canUpdate}
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
