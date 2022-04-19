import globalStyles from 'constants/styles';

import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {NavigationProp, RouteProp, useFocusEffect} from '@react-navigation/native';
import {GreenBlockRouteParamList, Tree} from 'types';
import {useWalletAccount} from 'services/web3';
import {Hex2Dec} from 'utilities/helpers/hex';

import Button from '../Button';
import Spacer from '../Spacer';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {TreeJourney} from 'screens/TreeSubmission/types';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import NoInternetTrees from 'components/TreeList/NoInternetTrees';
import usePlantedTrees from 'utilities/hooks/usePlantedTrees';
import useTempTrees from 'utilities/hooks/useTempTrees';
import {useTranslation} from 'react-i18next';
import {colors} from 'constants/values';
import {TreeImage} from 'components/TreeList/TreeImage';
import {Routes} from 'navigation';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTreeUpdateInterval} from 'utilities/hooks/treeUpdateInterval';

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
  route?: RouteProp<GreenBlockRouteParamList, Routes.TreeList>;
  navigation: NavigationProp<GreenBlockRouteParamList>;
  filter?: TreeFilter;
}

function Trees({route, navigation, filter}: Props) {
  // const navigation = useNavigation();
  const [initialFilter, setInitialFilter] = useState<TreeFilter | null>(filter || null);
  const {t} = useTranslation();
  const filters = useMemo<TreeFilterItem[]>(() => {
    return [
      {caption: TreeFilter.Submitted},
      {caption: TreeFilter.Temp},
      {caption: TreeFilter.OfflineCreate},
      {caption: TreeFilter.OfflineUpdate},
    ];
  }, []);

  const [currentFilter, setCurrentFilter] = useState<TreeFilterItem | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (initialFilter) {
        setCurrentFilter({caption: initialFilter});
        setInitialFilter(null);
      } else {
        setCurrentFilter(filters[0]);
      }
    }, [initialFilter, filters]),
  );

  const address = useWalletAccount();

  const isConnected = useNetInfoConnected();

  const treeUpdateInterval = useTreeUpdateInterval();

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

  const {
    offlineTrees,
    offlineLoadings,
    offlineUpdateLoadings,
    handleSubmitOfflineAssignedTree,
    handleSubmitOfflineTree,
    handleUpdateOfflineTree,
    handleSendAllOffline,
    loadingMinimized,
    setLoadingMinimized,
  } = useOfflineTrees();

  const dim = useWindowDimensions();

  const allLoading = plantedTreesQuery.loading || tempTreesQuery.loading;
  const offlineLoading = Boolean(offlineLoadings?.length || offlineUpdateLoadings?.length);
  const showLoadingModal = offlineLoading && !loadingMinimized;

  const handleSelectTree = tree => {
    if (tree.item?.treeStatus == 2) {
      const isTreePlantedOffline = offlineTrees?.planted?.find(item => item.treeIdToPlant === tree.item?.id);
      if (isTreePlantedOffline) {
        showAlert({
          title: t('warning'),
          message: t('notVerifiedTree'),
          mode: AlertMode.Warning,
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: Routes.TreeSubmission,
              params: {
                treeIdToPlant: tree.item.id,
                tree: tree.item,
                isSingle: true,
                initialRouteName: Routes.SelectPhoto,
              },
            },
          ],
        });
      }
    } else if (tree.item?.treeStatus == 3) {
      showAlert({
        title: t('warning'),
        message: t('notVerifiedTree'),
        mode: AlertMode.Warning,
      });
    } else {
      navigation.navigate(Routes.TreeDetails, {tree: tree.item});
    }
  };

  const handleRegSelectTree = () => {
    showAlert({
      title: t('warning'),
      message: t('notVerifiedTree'),
      mode: AlertMode.Warning,
    });

    return;
  };

  const renderFilters = () =>
    filters.map(item => {
      const {caption} = item;
      const variant = currentFilter?.caption === caption ? 'secondary' : 'primary';

      return (
        <Button
          key={caption}
          caption={t(caption)}
          variant={variant}
          style={{marginHorizontal: 8, marginBottom: 8}}
          onPress={() => setCurrentFilter(item)}
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
    const imageFs = tree.item?.treeSpecsEntity?.imageFs;
    const size = imageFs ? 60 : 48;
    const style = !imageFs ? {marginTop: 8} : {};

    return (
      <TouchableOpacity key={tree.item.id} style={styles.tree} onPress={() => handleSelectTree(tree)}>
        <TreeImage tree={tree.item} tint size={size} style={style} treeUpdateInterval={treeUpdateInterval} />
        <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{Hex2Dec(tree.item.id)}</Text>
      </TouchableOpacity>
    );
  };

  const tempRenderItem = tree => {
    return (
      <TouchableOpacity key={tree.item.id} style={styles.tree} onPress={handleRegSelectTree}>
        <TreeImage tree={tree.item} size={60} tint color={colors.yellow} treeUpdateInterval={treeUpdateInterval} />
        <Text style={[globalStyles.normal, globalStyles.textCenter, styles.treeName]}>{Hex2Dec(tree.item.id)}</Text>
      </TouchableOpacity>
    );
  };

  const tempEmptyContent = () => {
    if (tempTrees?.length === 0 && (plantedTrees?.length || 0) > 0) {
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
            navigation.navigate(Routes.TreeSubmission);
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
          keyExtractor={(_, i) => i.toString()}
          ListEmptyComponent={isConnected ? EmptyContent : NoInternetTrees}
          style={{flex: 1}}
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
          keyExtractor={(_, i) => i.toString()}
          ListEmptyComponent={isConnected ? tempEmptyContent : NoInternetTrees}
          style={{flex: 1}}
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
      if (!item.tree) {
        return null;
      }
      const isAssignedTree = item.treeIdToPlant;
      const id = isPlanted
        ? isAssignedTree
          ? Hex2Dec(isAssignedTree)
          : index + 1
        : Hex2Dec(item.treeIdToUpdate || '');
      const submitLoading = offlineLoadings.find(
        offlineId => offlineId === item.offlineId || offlineId === item.treeIdToPlant,
      );
      const updateLoading = offlineUpdateLoadings.find(offlineId => offlineId === item.treeIdToUpdate);

      const loading = isPlanted ? !!submitLoading : !!updateLoading;
      const disabled = isPlanted ? offlineLoadings.length > 0 : offlineUpdateLoadings.length > 0;

      const caption = loading ? null : 'Send';
      const onPress = () =>
        isPlanted
          ? isAssignedTree
            ? handleSubmitOfflineAssignedTree(item)
            : handleSubmitOfflineTree(item)
          : handleUpdateOfflineTree(item as Tree & TreeJourney);

      return (
        <TouchableOpacity onPress={onPress} key={id} style={styles.offlineTree} disabled={disabled}>
          <TreeImage
            tree={item.tree}
            tint
            size={60}
            isNursery={item.isSingle === false}
            color={colors.yellow}
            treeUpdateInterval={treeUpdateInterval}
          />
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
            onPress={!disabled && !loading ? onPress : undefined}
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
          keyExtractor={(_, i) => i.toString()}
          ListEmptyComponent={isConnected ? () => offlineEmpty(isPlanted) : NoInternetTrees}
          style={{flex: 1}}
          numColumns={calcTreeColumnNumber()}
          contentContainerStyle={styles.listScrollWrapper}
        />
        {loadingMinimized && offlineLoading && (
          <>
            <Spacer times={2} />
            <Button
              caption={t('treeInventory.showProgress')}
              variant="tertiary"
              onPress={() => setLoadingMinimized(false)}
              loading={offlineLoading}
            />
            <Spacer times={2} />
          </>
        )}
        {data && data?.length > 1 && !offlineLoading && (
          <Button
            caption={t('treeInventory.submitAll')}
            variant="tertiary"
            onPress={() => handleSendAllOffline(data, isPlanted)}
          />
        )}
      </View>
    );
  };

  const renderLoadingModal = () => {
    return (
      <Modal style={{flex: 1}} visible={showLoadingModal} onRequestClose={() => setLoadingMinimized(true)} transparent>
        <View style={{backgroundColor: colors.grayOpacity, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: '75%',
              paddingHorizontal: 16,
              paddingVertical: 24,
              backgroundColor: colors.khaki,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              marginVertical: 8,
            }}
          >
            <ActivityIndicator color={colors.green} size="large" />
            <Text style={{marginVertical: 8, textAlign: 'center'}}>{t('submitTree.offlineLoading')}</Text>
            <Text style={{marginVertical: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 14}}>
              {t('submitTree.offlineSubmittingNotCloseApp')}
            </Text>
            <Button variant="primary" caption={t('submitTree.minimize')} onPress={() => setLoadingMinimized(true)} />
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
          paddingBottom: 40,
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
  listScrollWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeLabel: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  tree: {
    width: 60,
    height: 80,
    marginHorizontal: 5,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offlineTree: {
    width: 60,
    height: 100,
    marginHorizontal: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  treeImage: {
    width: 64,
    height: 64,
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
