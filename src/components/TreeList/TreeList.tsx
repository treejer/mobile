import globalStyles from 'constants/styles';

import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {NavigationProp, RouteProp, useFocusEffect} from '@react-navigation/native';
import {GreenBlockRouteParamList, Tree} from 'types';
import {useWalletAccount, useWeb3} from 'services/web3';
import {Hex2Dec} from 'utilities/helpers/hex';

import Button from '../Button';
import Spacer from '../Spacer';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {TreeJourney} from 'screens/TreeSubmission/types';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import NoInternetTrees from 'components/TreeList/NoInternetTrees';
import usePlantedTrees from 'utilities/hooks/usePlantedTrees';
import useTempTrees from 'utilities/hooks/useTempTrees';
import {getHttpDownloadUrl, upload, uploadContent} from 'utilities/helpers/IPFS';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import config from 'services/config';
import {currentTimestamp} from 'utilities/helpers/date';
import {useTranslation} from 'react-i18next';
import {colors} from 'constants/values';
import {useSettings} from 'services/settings';
import {assignedTreeJSON, newTreeJSON, updateTreeJSON} from 'utilities/helpers/submitTree';

export enum TreeFilter {
  All = 'All',
  Submitted = 'Submitted',
  Temp = 'Not Verified',
  OfflineCreate = 'Planted Offline',
  OfflineUpdate = 'Updated Offline',
}

export interface TreeFilterItem {
  caption: TreeFilter;
}

interface Props {
  route?: RouteProp<GreenBlockRouteParamList, 'TreeList'>;
  navigation: NavigationProp<GreenBlockRouteParamList>;
  filter?: TreeFilter;
}

function Trees({route, navigation, filter}: Props) {
  // const navigation = useNavigation();
  const [initialFilter, setInitialFilter] = useState(filter);
  const {t} = useTranslation();
  const {useGSN} = useSettings();
  const filters = useMemo<TreeFilterItem[]>(() => {
    return [
      {caption: TreeFilter.Submitted},
      {caption: TreeFilter.Temp},
      {caption: TreeFilter.OfflineCreate},
      {caption: TreeFilter.OfflineUpdate},
    ];
  }, []);

  const [currentFilter, setCurrentFilter] = useState<TreeFilterItem>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (initialFilter) {
        setCurrentFilter({caption: initialFilter});
        setInitialFilter(null);
      } else {
        setCurrentFilter(filters[0]);
      }
    }, [initialFilter, filters]),
  );

  const [offlineLoadings, setOfflineLoadings] = useState([]);
  const [offlineUpdateLoadings, setOfflineUpdateLoadings] = useState([]);

  const address = useWalletAccount();

  const isConnected = useNetInfoConnected();

  const {
    tempTreesQuery,
    tempTrees,
    refetchTempTrees,
    refetching: tempTreesRefetching,
    loadMore: tempLoadMore,
  } = useTempTrees(address);

  const {
    plantedTrees,
    plantedTreesQuery,
    refetchPlantedTrees,
    refetching: plantedRefetching,
    loadMore: plantedLoadMore,
  } = usePlantedTrees(address);

  const {offlineTrees, dispatchRemoveOfflineTree, dispatchRemoveOfflineUpdateTree} = useOfflineTrees();

  const dim = useWindowDimensions();

  const web3 = useWeb3();

  const allLoading = plantedTreesQuery.loading || tempTreesQuery.loading;
  const offlineLoading = Boolean(offlineLoadings?.length || offlineUpdateLoadings?.length);

  const handleSelectTree = tree => {
    if (tree.item?.treeStatus == 2) {
      const isTreePlantedOffline = offlineTrees?.planted?.find(item => item.treeIdToPlant === tree.item?.id);
      if (isTreePlantedOffline) {
        Alert.alert(t('warning'), t('notVerifiedTree'));
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TreeSubmission',
              params: {
                treeIdToPlant: tree.item.id,
                tree: tree.item,
                isSingle: true,
                initialRouteName: 'SelectPhoto',
              },
            },
          ],
        });
      }
    } else if (tree.item?.treeStatus == 3) {
      Alert.alert(t('warning'), t('notVerifiedTree'));
    } else {
      navigation.navigate('TreeDetails', {tree: tree.item});
    }
  };

  useEffect(() => {
    if (route?.params?.shouldNavigateToTreeDetails) {
      refetchPlantedTrees();
    }
  }, [plantedRefetching, route.params, refetchPlantedTrees]);

  const handleRegSelectTree = tree => {
    Alert.alert(t('warning'), t('notVerifiedTree'));

    return;
  };

  const handleUpdateOfflineTree = async (treeJourney: Tree & TreeJourney) => {
    if (treeJourney?.treeSpecsEntity == null || typeof treeJourney?.treeSpecsEntity === 'undefined') {
      Alert.alert(t('cannotUpdateTree'));
      return;
    }
    setOfflineUpdateLoadings([...offlineUpdateLoadings, treeJourney.treeIdToUpdate]);
    try {
      const photoUploadResult = await upload(treeJourney.photo?.path);

      const jsonData = updateTreeJSON({
        tree: treeJourney,
        journey: treeJourney,
        photoUploadHash: photoUploadResult.Hash,
      });

      const metaDataUploadResult = await uploadContent(JSON.stringify(jsonData));

      console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

      const receipt = await sendTransactionWithGSN(
        web3,
        address,
        config.contracts.TreeFactory,
        'updateTree',
        [treeJourney.treeIdToUpdate, metaDataUploadResult.Hash],
        useGSN,
      );
      dispatchRemoveOfflineUpdateTree(treeJourney.treeIdToUpdate);
      setOfflineUpdateLoadings(offlineUpdateLoadings.filter(id => id !== treeJourney.treeIdToUpdate));
      console.log(receipt, 'receipt');
    } catch (e) {
      setOfflineUpdateLoadings(offlineUpdateLoadings.filter(id => id !== treeJourney.treeIdToUpdate));
      Alert.alert(t('transactionFailed.title'), e?.message || e.error?.message || t('transactionFailed.tryAgain'));
    }
    setOfflineUpdateLoadings(offlineUpdateLoadings.filter(id => id !== treeJourney.treeIdToUpdate));
  };

  const handleSubmitOfflineAssignedTree = async (journey: TreeJourney) => {
    if (!isConnected) {
      Alert.alert(t('noInternet'), t('submitWhenOnline'));
      return;
    }
    try {
      setOfflineLoadings([...offlineLoadings, journey.offlineId]);
      const photoUploadResult = await upload(journey.photo?.path);

      const jsonData = assignedTreeJSON({
        journey,
        tree: journey?.tree,
        photoUploadHash: photoUploadResult.Hash,
      });

      const metaDataUploadResult = await uploadContent(JSON.stringify(jsonData));
      console.log(metaDataUploadResult, '<== check this');

      const receipt = await sendTransactionWithGSN(
        web3,
        address,
        config.contracts.TreeFactory,
        'plantAssignedTree',
        [Hex2Dec(journey.treeIdToPlant), metaDataUploadResult.Hash, jsonData.updates[0].created_at, 0],
        useGSN,
      );

      console.log(receipt, 'receipt');
      console.log(receipt.transactionHash, 'receipt.transactionHash');

      setOfflineLoadings(offlineLoadings.filter(id => id !== journey.offlineId));
      dispatchRemoveOfflineTree(journey.offlineId);
    } catch (e) {
      console.log(e, 'e inside handleSubmitOfflineAssignedTree');
      Alert.alert(t('transactionFailed.title'), e?.message || e.error?.message || t('transactionFailed.tryAgain'));
      setOfflineLoadings(offlineLoadings.filter(id => id !== journey.treeIdToPlant));
    }
    setOfflineLoadings(offlineLoadings.filter(id => id !== journey.treeIdToPlant));
  };

  const alertNoInternet = () => {
    Alert.alert(t('noInternet'), t('submitWhenOnline'));
  };

  const handleSubmitOfflineTree = async (treeJourney: TreeJourney) => {
    if (!isConnected) {
      alertNoInternet();
    } else {
      setOfflineLoadings([...offlineLoadings, treeJourney.offlineId]);
      try {
        const photoUploadResult = await upload(treeJourney.photo.path);
        const jsonData = newTreeJSON({
          journey: treeJourney,
          photoUploadHash: photoUploadResult.Hash,
        });

        const metaDataUploadResult = await uploadContent(JSON.stringify(jsonData));
        console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

        const receipt = await sendTransactionWithGSN(
          web3,
          address,
          config.contracts.TreeFactory,
          'plantTree',
          [metaDataUploadResult.Hash, jsonData.updates[0].created_at, 0],
          useGSN,
        );

        console.log(receipt, 'receipt');
        console.log(receipt.transactionHash, 'receipt.transactionHash');

        setOfflineLoadings(offlineLoadings.filter(id => id !== treeJourney.offlineId));
        dispatchRemoveOfflineTree(treeJourney.offlineId);
      } catch (e) {
        Alert.alert(t('transactionFailed.title'), e?.message || e.error?.message || t('transactionFailed.tryAgain'));
        setOfflineLoadings(offlineLoadings.filter(id => id !== treeJourney.offlineId));
      }
      setOfflineLoadings(offlineLoadings.filter(id => id !== treeJourney.offlineId));
    }
  };

  const handleSendAllOffline = async (trees: TreeJourney[] | Tree[], isPlanted: boolean) => {
    if (!isConnected) {
      alertNoInternet();
    } else {
      try {
        for (const tree of trees) {
          if (isPlanted) {
            if ((tree as TreeJourney).treeIdToPlant) {
              await handleSubmitOfflineAssignedTree(tree as TreeJourney);
            } else {
              await handleSubmitOfflineTree(tree as TreeJourney);
            }
          } else {
            await handleUpdateOfflineTree(tree as Tree);
          }
        }
        Alert.alert(t('offlineTreesSubmitted'));
      } catch (e) {
        Alert.alert(t('error'), e.message || t('tryAgain'));
      }
    }
  };

  const renderFilters = () =>
    filters.map(filter => {
      const {caption} = filter;
      const variant = currentFilter.caption === caption ? 'secondary' : 'primary';

      return (
        <Button
          key={caption}
          caption={t(caption)}
          variant={variant}
          style={{marginHorizontal: 8, marginBottom: 8}}
          onPress={() => setCurrentFilter(filter)}
        />
      );
    });

  const renderFilterComponent = () => {
    switch (currentFilter?.caption) {
      case TreeFilter.All:
        return (
          <>
            {renderSubmittedTrees()}
            {renderNotVerifiedTrees()}
            {renderOfflineTrees(true)}
            {renderOfflineTrees(false)}
          </>
        );
      case TreeFilter.Submitted:
        return renderSubmittedTrees();
      case TreeFilter.Temp:
        return renderNotVerifiedTrees();
      case TreeFilter.OfflineCreate:
        return renderOfflineTrees(true);
      case TreeFilter.OfflineUpdate:
        return renderOfflineTrees(false);
    }
    return null;
  };

  const RenderItem = tree => {
    return (
      <TouchableOpacity key={tree.item.id} style={styles.tree} onPress={() => handleSelectTree(tree)}>
        <Image
          style={[styles.treeImage, tree.item.birthDate && styles.inactiveTree]}
          source={require('../../../assets/icons/tree.png')}
        />
        <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{Hex2Dec(tree.item.id)}</Text>
      </TouchableOpacity>
    );
  };

  const tempRenderItem = tree => {
    return (
      <TouchableOpacity key={tree.item.id} style={styles.tree} onPress={() => handleRegSelectTree(tree)}>
        <Image
          style={[styles.treeImage, tree.item.birthDate && styles.inactiveTree]}
          source={require('../../../assets/icons/tree.png')}
        />
        <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{Hex2Dec(tree.item.id)}</Text>
      </TouchableOpacity>
    );
  };

  const tempEmptyContent = () => {
    if (tempTrees?.length === 0 && plantedTrees?.length > 0) {
      return null;
    }
    return (
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill, {paddingVertical: 25}]}>
        <Spacer times={20} />
        <Text>{t('noPlantedTrees')}</Text>
        <Spacer times={5} />
        <Button
          caption={t('plantFirstTree')}
          variant="cta"
          onPress={() => {
            navigation.navigate('TreeSubmission');
          }}
        />
      </View>
    );
  };

  const offlineEmpty = (isPlanted: boolean) => {
    return (
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill, {paddingVertical: 25}]}>
        <Text>{t('noOfflineTree', {type: t(isPlanted ? 'planted' : 'updated')})}</Text>
      </View>
    );
  };

  const EmptyContent = () => {
    return (
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill, {paddingVertical: 25}]}>
        <Spacer times={20} />
        <Text>{t('noAssigned')}</Text>
      </View>
    );
  };

  const calcTreeColumnNumber = () => {
    if (dim?.width >= 414) {
      return 6;
    }
    return 5;
  };

  const renderSubmittedTrees = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.treeLabel}>{t('submittedTrees')}</Text>
        <FlatList
          // @ts-ignore
          data={plantedTrees}
          initialNumToRender={20}
          onEndReachedThreshold={0.1}
          renderItem={RenderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={isConnected ? EmptyContent : NoInternetTrees}
          style={{paddingVertical: 20, flex: 1}}
          refreshing
          onEndReached={plantedLoadMore}
          onRefresh={refetchPlantedTrees}
          numColumns={calcTreeColumnNumber()}
          contentContainerStyle={styles.listScrollWrapper}
          refreshControl={<RefreshControl refreshing={plantedRefetching} onRefresh={refetchPlantedTrees} />}
        />
      </View>
    );
  };

  const renderNotVerifiedTrees = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={styles.treeLabel}>{t('notSubmittedTrees')}</Text>
        <FlatList
          // @ts-ignore
          data={tempTrees}
          renderItem={tempRenderItem}
          initialNumToRender={20}
          onEndReachedThreshold={0.1}
          onEndReached={tempLoadMore}
          keyExtractor={item => item.id}
          ListEmptyComponent={isConnected ? tempEmptyContent : NoInternetTrees}
          style={{paddingVertical: 20, flex: 1}}
          refreshing
          onRefresh={refetchTempTrees}
          numColumns={calcTreeColumnNumber()}
          contentContainerStyle={styles.listScrollWrapper}
          refreshControl={<RefreshControl refreshing={tempTreesRefetching} onRefresh={refetchTempTrees} />}
        />
      </View>
    );
  };

  const renderOfflineTrees = (isPlanted: boolean) => {
    const prop = isPlanted ? 'planted' : 'updated';

    const renderItem = ({item, index}: {item: TreeJourney; index: number}) => {
      const isAssignedTree = item.treeIdToPlant;
      const id = isPlanted ? (isAssignedTree ? Hex2Dec(isAssignedTree) : index + 1) : Hex2Dec(item.treeIdToUpdate);
      const submitLoading = offlineLoadings.find(
        offlineId => offlineId === item.offlineId || offlineId === item.treeIdToPlant,
      );
      const updateLoading = offlineUpdateLoadings.find(offlineId => offlineId === item.treeIdToUpdate);

      const loading = isPlanted ? submitLoading : updateLoading;
      const disabled = isPlanted ? offlineLoadings.length > 0 : offlineUpdateLoadings.length > 0;

      const caption = loading ? null : 'Send';
      const onPress = () =>
        isPlanted
          ? isAssignedTree
            ? handleSubmitOfflineAssignedTree(item)
            : handleSubmitOfflineTree(item)
          : handleUpdateOfflineTree(item as Tree & TreeJourney);

      return (
        <TouchableOpacity onPress={onPress} key={id} style={styles.offlineTree}>
          <Image style={[styles.treeImage, styles.inactiveTree]} source={require('../../../assets/icons/tree.png')} />
          <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{id}</Text>
          <Button
            variant="secondary"
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 6,
              paddingVertical: 4,
            }}
            textStyle={{fontSize: 12}}
            caption={caption}
            loading={loading}
            disabled={disabled}
            onPress={!disabled && !loading && onPress}
          />
        </TouchableOpacity>
      );
    };

    const data = offlineTrees[prop];

    // console.log(offlineTrees[prop], '<====');
    return (
      <View style={[globalStyles.fill]}>
        <Text style={styles.treeLabel}>{t('offlineTrees', {type: t(isPlanted ? 'Planted' : 'Updated')})}</Text>
        <FlatList<TreeJourney>
          data={data}
          renderItem={renderItem}
          keyExtractor={item => (isPlanted ? item.offlineId : item.treeIdToUpdate)}
          ListEmptyComponent={isConnected ? () => offlineEmpty(isPlanted) : NoInternetTrees}
          style={{paddingVertical: 20, flex: 1}}
          numColumns={calcTreeColumnNumber()}
          contentContainerStyle={styles.listScrollWrapper}
        />
        {data?.length > 1 && (
          <Button
            caption={t('treeInventory.submitAll')}
            variant="tertiary"
            onPress={() => handleSendAllOffline(data, isPlanted)}
            disabled={offlineLoading}
            loading={offlineLoading}
          />
        )}
      </View>
    );
  };

  const renderLoadingModal = () => {
    return (
      <Modal style={{flex: 1}} visible={offlineLoading} onRequestClose={null} transparent>
        <View style={{backgroundColor: colors.grayOpacity, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: '75%',
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: colors.khaki,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              marginVertical: 8,
            }}
          >
            <ActivityIndicator color={colors.green} size="large" />
            <Text style={{marginVertical: 8, textAlign: 'center'}}>{t('submitTree.offlineLoading')}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  if (allLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={[
        globalStyles.screenView,
        globalStyles.safeArea,
        {
          paddingBottom: 60,
          paddingVertical: 10,
          paddingHorizontal: 12,
          flex: 1,
        },
      ]}
    >
      {renderLoadingModal()}
      <Spacer times={6} />
      <Text style={[globalStyles.h3, globalStyles.textCenter]}>{t('treeInventory.title')}</Text>
      <Spacer times={4} />
      <View
        style={[
          globalStyles.horizontalStack,
          {
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        {currentFilter && renderFilters()}
      </View>
      {renderFilterComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  listWrapper: {
    paddingBottom: 120,
  },
  listScrollWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeLabel: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  tree: {
    width: 54,
    height: 74,
    marginHorizontal: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  offlineTree: {
    width: 54,
    height: 100,
    marginHorizontal: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  treeImage: {
    width: 54,
    height: 54,
  },
  treeName: {
    fontWeight: '700',
    fontSize: 12,
  },
  inactiveTree: {
    opacity: 0.3,
  },
});

export default Trees;
