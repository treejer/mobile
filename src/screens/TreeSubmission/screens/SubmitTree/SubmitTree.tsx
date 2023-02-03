import React, {useCallback, useEffect, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {TransactionReceipt} from 'web3-core';
import {ActivityIndicator, Alert, ScrollView, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Routes} from 'navigation/index';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import SubmitTreeModal from 'components/SubmitTreeModal/SubmitTreeModal';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';
import {upload, uploadContent} from 'utilities/helpers/IPFS';
import {sendWeb3Transaction} from 'utilities/helpers/sendTransaction';
import {Hex2Dec} from 'utilities/helpers/hex';
import {currentTimestamp} from 'utilities/helpers/date';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {
  assignedTreeJSON,
  canUpdateTreeLocation,
  newTreeJSON,
  photoToUpload,
  updateTreeJSON,
} from 'utilities/helpers/submitTree';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {ContractType} from 'services/config';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionStackNavigationProp} from 'screens/TreeSubmission/TreeSubmission';
import {useCurrentJourney} from 'services/currentJourney';
import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useConfig, useMagic, useTreeFactory, useWalletAccount, useWalletWeb3} from 'ranger-redux/modules/web3/web3';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';

interface Props {
  navigation: TreeSubmissionStackNavigationProp<Routes.SubmitTree>;
  plantTreePermissions: TUsePlantTreePermissions;
}

function SubmitTree(props: Props) {
  const {navigation, plantTreePermissions} = props;
  const {showPermissionModal} = plantTreePermissions;

  const {journey, clearJourney} = useCurrentJourney();
  const {offlineTrees, dispatchRemoveOfflineUpdateTree} = useOfflineTrees();

  const {t} = useTranslation();

  const {useBiconomy, changeCheckMetaData} = useSettings();

  const [photoHash, setPhotoHash] = useState<string>();
  const [metaDataHash, setMetaDataHash] = useState<string>();
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const config = useConfig();
  const isConnected = useNetInfoConnected();
  const treeFactory = useTreeFactory();

  const birthDay = currentTimestamp();

  const {sendEvent} = useAnalytics();

  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isAssignedTreeToPlant = typeof journey?.treeIdToPlant !== 'undefined';

  const web3 = useWalletWeb3();
  const wallet = useWalletAccount();
  const magic = useMagic();

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

  const handleUploadToIpfs = useCallback(async () => {
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
      const photoUploadResult = await upload(config.ipfsPostURL, photoToUpload(journey.photo));
      setPhotoHash(photoUploadResult.Hash);

      let jsonData;
      if (isUpdate) {
        jsonData = updateTreeJSON(config.ipfsGetURL, {
          journey,
          tree: updateTreeData as TreeDetailQueryQueryData.Tree,
          photoUploadHash: photoUploadResult.Hash,
        });
      } else {
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

      if (Object.keys(jsonData).length === 0) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: Routes.MyProfile}],
          }),
        );
        showAlert({
          message: t('emptyTreeSpecs'),
          mode: AlertMode.Error,
        });
        clearJourney();
      }

      console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

      setMetaDataHash(metaDataUploadResult.Hash);

      setIsReadyToSubmit(true);
    } catch (e: any) {
      showAlert({
        message: e?.message || t('tryAgain'),
        mode: AlertMode.Error,
      });
    }
  }, [
    isUpdate,
    updateTreeData,
    isAssignedTreeToPlant,
    assignedTreeData,
    journey,
    t,
    config.ipfsPostURL,
    config.ipfsGetURL,
    navigation,
    clearJourney,
  ]);

  const handleSendUpdateTransaction = useCallback(
    async (treeId: number) => {
      console.log(metaDataHash, '====> metaDataHash <====');

      const receipt = await sendWeb3Transaction(
        magic,
        config,
        ContractType.TreeFactory,
        web3,
        wallet,
        'updateTree',
        [treeId, metaDataHash],
        useBiconomy,
      );

      return receipt;
    },
    [metaDataHash, magic, config, web3, wallet, useBiconomy],
  );
  const handleSendCreateTransaction = useCallback(async () => {
    let receipt;
    if (typeof journey?.treeIdToPlant !== 'undefined') {
      console.log('here plant tree', Hex2Dec(journey.treeIdToPlant));
      // const tx = await treeFactory.methods.plantAssignedTree(Hex2Dec(journey.treeIdToPlant), metaDataHash, birthDay, 0);
      // receipt =  await sendTransactionWithWallet(web3, tx, config.contracts.TreeFactory.address, wallet);

      receipt = await sendWeb3Transaction(
        magic,
        config,
        ContractType.TreeFactory,
        web3,
        wallet,
        'plantAssignedTree',
        [Hex2Dec(journey.treeIdToPlant), metaDataHash, birthDay, 0],
        useBiconomy,
      );
    } else {
      if (journey.plantingModel) {
        receipt = await sendWeb3Transaction(
          magic,
          config,
          ContractType.TreeFactory,
          web3,
          wallet,
          'plantMarketPlaceTree',
          [metaDataHash, birthDay, 0, Hex2Dec(journey.plantingModel)],
          useBiconomy,
        );
      } else {
        receipt = await sendWeb3Transaction(
          magic,
          config,
          ContractType.TreeFactory,
          web3,
          wallet,
          'plantTree',
          [metaDataHash, birthDay, 0],
          useBiconomy,
        );
      }
    }

    console.log(receipt.transactionHash, 'receipt.transactionHash');

    return receipt;
  }, [journey.treeIdToPlant, journey.plantingModel, magic, config, web3, wallet, metaDataHash, birthDay, useBiconomy]);

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
        const distance = calcDistanceInMeters(
          {
            latitude: journey?.photoLocation?.latitude || 0,
            longitude: journey?.photoLocation?.longitude || 0,
          },
          {
            latitude: Number(journey?.tree?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
            longitude: Number(journey?.tree?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
          },
        );

        transaction = await handleSendUpdateTransaction(Number(journey.treeIdToUpdate));

        showAlert({
          title: t('success'),
          message: t('submitTree.updated'),
          mode: AlertMode.Success,
        });
        if (offlineTrees.updated?.some(id => id === journey.treeIdToUpdate)) {
          dispatchRemoveOfflineUpdateTree(journey.treeIdToUpdate);
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: Routes.GreenBlock, params: {filter: TreeFilter.Temp}}],
          }),
        );
        clearJourney();
      } else {
        sendEvent('add_tree_confirm');
        transaction = await handleSendCreateTransaction();

        showAlert({
          title: t('success'),
          message: t('submitTree.submitted'),
          mode: AlertMode.Success,
        });
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: Routes.GreenBlock}],
          }),
        );
        clearJourney();
        if (config.isMainnet) {
          changeCheckMetaData(true);
        }
      }
      // setTxHash(transaction.transactionHash);

      // console.log('Transaction: ', transaction);
    } catch (error) {
      showAlert({
        title: t('submitTree.error'),
        message: t('submitTree.transactionFailed'),
        mode: AlertMode.Error,
      });
      console.warn('Error', error);
      console.log('Error', error);
    }
    setSubmitting(false);
  }, [
    wallet,
    t,
    journey.treeIdToUpdate,
    journey?.photoLocation?.latitude,
    journey?.photoLocation?.longitude,
    journey?.tree?.treeSpecsEntity?.latitude,
    journey?.tree?.treeSpecsEntity?.longitude,
    sendEvent,
    metaDataHash,
    handleSendUpdateTransaction,
    navigation,
    clearJourney,
    handleSendCreateTransaction,
    config.isMainnet,
    changeCheckMetaData,
  ]);

  useEffect(() => {
    (async function () {
      if (journey.photo) {
        if (
          ((typeof journey.isSingle == 'undefined' || journey.isSingle === true || isAssignedTreeToPlant) &&
            !isReadyToSubmit) ||
          !journey.photo ||
          (!journey.location && !isUpdate)
        ) {
          await handleUploadToIpfs();
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journey.photo]);

  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
  const canUpdateLocation = canUpdateTreeLocation(journey, isNursery);
  const isSingle = journey?.isSingle;
  const count = journey?.nurseryCount;

  const title = isSingle
    ? 'submitTree.submitTree'
    : isSingle === false
    ? 'submitTree.nurseryCount'
    : isUpdate
    ? 'submitTree.updateTree'
    : 'submitTree.submitTree';

  if (showPermissionModal) {
    return <CheckPermissions plantTreePermissions={plantTreePermissions} />;
  }

  const contentMarkup = isReadyToSubmit ? (
    <TreeSubmissionStepper currentStep={4}>
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
    <TreeSubmissionStepper currentStep={3}>
      <Spacer times={1} />
      <Text>{t('submitTree.photoUpdated')}</Text>

      <View style={{alignItems: 'center', justifyContent: 'center', padding: 15}}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    </TreeSubmissionStepper>
  );

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <ScreenTitle title={`${t(title, {count})} ${isUpdate ? `#${Hex2Dec(journey.tree?.id!)}` : ''}`} />
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        {journey.isSingle === false && <SubmitTreeModal />}
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
          {contentMarkup}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SubmitTree;
