import globalStyles from 'constants/styles';

import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CommonActions, NavigationProp, RouteProp, useFocusEffect} from '@react-navigation/native';

import {Routes} from 'navigation/index';
import {GreenBlockRouteParamList, Tree} from 'types';
import {colors} from 'constants/values';
import NoInternetTrees from 'components/TreeList/NoInternetTrees';
import {TreeImage} from 'components/TreeList/TreeImage';
import {TreeFilter, TreeFilterButton, TreeFilterItem} from 'components/TreeList/TreeFilterItem';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {TreeColorsInfoModal} from 'components/TreeList/TreeColorsInfoModal';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {Hex2Dec} from 'utilities/helpers/hex';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import {isWeb} from 'utilities/helpers/web';
import {usePagination} from 'utilities/hooks/usePagination';
import {useCurrentJourney} from 'services/currentJourney';
import TreeSymbol from './TreeSymbol';
import Button from '../Button';
import Spacer from '../Spacer';
import TempTreesQuery, {
  TempTreesQueryQueryData,
  TempTreesQueryQueryPartialData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/TempTreesQuery.graphql';
import planterTreeQuery, {
  PlanterTreesQueryQueryData,
  PlanterTreesQueryQueryPartialData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';

interface Props {
  route?: RouteProp<GreenBlockRouteParamList, Routes.TreeList>;
  navigation: NavigationProp<GreenBlockRouteParamList>;
  filter?: TreeFilter;
}

function Trees({navigation, filter}: Props) {
  const [initialFilter, setInitialFilter] = useState<TreeFilter | null>(filter || null);
  const [treeColorsModalVisible, setTreeColorModalVisible] = useState<boolean>(false);
  const {t} = useTranslation();
  const filters = useMemo<TreeFilterItem[]>(() => {
    const offlineFilters = [
      {caption: TreeFilter.OfflineCreate, offline: true},
      {caption: TreeFilter.OfflineUpdate, offline: true},
    ];
    return [{caption: TreeFilter.Submitted}, {caption: TreeFilter.Temp}, ...(isWeb() ? [] : offlineFilters)];
  }, []);

  const [currentFilter, setCurrentFilter] = useState<TreeFilterItem | null>(null);
  const {setNewJourney} = useCurrentJourney();

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
    persistedData: tempTrees,
    query: tempTreeQuery,
    refetching: tempTreesRefetching,
    refetchData: refetchTempTrees,
    loadMore: tempLoadMore,
  } = usePagination<
    TempTreesQueryQueryData,
    TempTreesQueryQueryData.Variables,
    TempTreesQueryQueryPartialData.TempTrees[]
  >(
    TempTreesQuery,
    {
      address: address.toString().toLocaleLowerCase(),
    },
    'tempTrees',
    TreeFilter.Temp,
  );

  const {
    persistedData: plantedTrees,
    query: plantedTreesQuery,
    refetchData: refetchPlantedTrees,
    refetching: plantedRefetching,
    loadMore: plantedLoadMore,
  } = usePagination<
    PlanterTreesQueryQueryData,
    PlanterTreesQueryQueryData.Variables,
    PlanterTreesQueryQueryPartialData.Trees[]
  >(
    planterTreeQuery,
    {
      address: address.toString().toLocaleLowerCase(),
    },
    'trees',
    TreeFilter.Submitted,
  );

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

  const allLoading = plantedTreesQuery.loading || tempTreeQuery.loading;
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
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: Routes.TreeSubmission,
                params: {
                  initialRouteName: Routes.SelectPhoto,
                },
              },
            ],
          }),
        );
        setNewJourney({
          treeIdToPlant: tree.item.id,
          tree: tree.item,
          isSingle: true,
        });
      }
    } else if (tree.item?.treeStatus == 3) {
      showAlert({
        title: t('warning'),
        message: t('notVerifiedTree'),
        mode: AlertMode.Warning,
      });
    } else {
      navigation.navigate(Routes.TreeDetails, {tree: tree.item, tree_id: Hex2Dec(tree.item.id).toString()});
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

  const renderFilters = () => {
    const offlineFilters = filters.filter(item => item.offline);
    const onlineFilters = filters.filter(item => !item.offline);

    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterWrapper}>
          {onlineFilters.map(item => (
            <TreeFilterButton
              key={item.caption}
              item={item}
              currentFilter={currentFilter}
              onPress={() => setCurrentFilter(item)}
            />
          ))}
        </View>
        <View style={styles.filterWrapper}>
          {offlineFilters.map(item => (
            <TreeFilterButton
              key={item.caption}
              item={item}
              currentFilter={currentFilter}
              onPress={() => setCurrentFilter(item)}
            />
          ))}
        </View>
      </View>
    );
  };

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
      <TreeSymbol
        tree={tree.item}
        size={size}
        style={style}
        treeUpdateInterval={treeUpdateInterval}
        handlePress={() => handleSelectTree(tree)}
      />
    );
  };

  const tempRenderItem = tree => {
    return (
      <TreeSymbol
        tree={tree.item}
        treeUpdateInterval={treeUpdateInterval}
        handlePress={handleRegSelectTree}
        color={colors.yellow}
        size={48}
        style={{marginTop: 8}}
      />
    );
  };

  const TempEmptyContent = () => {
    const hasTree = plantedTrees?.length || tempTrees?.length;
    const plantText = hasTree ? 'plantTree' : 'plantFirstTree';

    return (
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill, {paddingVertical: 25}]}>
        {!hasTree && (
          <>
            <Spacer times={20} />
            <Text>{t('noPlantedTrees')}</Text>
          </>
        )}
        <Spacer times={5} />
        <Button
          caption={t(plantText)}
          variant="cta"
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: Routes.TreeSubmission}],
              }),
            );
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
    const hasTree = plantedTrees?.length || tempTrees?.length;
    const plantText = hasTree ? 'plantTree' : 'plantFirstTree';

    return (
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill, {paddingVertical: 25}]}>
        <Spacer times={20} />
        <Text>{t('noAssignedOrVerified')}</Text>
        <Spacer times={5} />
        <Button
          caption={t(plantText)}
          variant="cta"
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: Routes.TreeSubmission}],
              }),
            );
          }}
        />
      </View>
    );
  };

  const calcTreeColumnNumber = () => {
    if (isWeb()) {
      return 5;
    } else {
      if (dim?.width >= 414) {
        return 6;
      }
      return 5;
    }
  };

  const renderSubmittedTrees = () => {
    return (
      <View style={{flex: 1}}>
        <Pressable onPress={() => setTreeColorModalVisible(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20}}>
            <Text style={styles.treeLabel}>{t('submittedTrees')}</Text>
            <Icon name="info-circle" size={20} color={colors.grayLight} style={{marginHorizontal: 8}} />
          </View>
        </Pressable>
        <PullToRefresh onRefresh={refetchPlantedTrees}>
          <FlatList
            // @ts-ignore
            data={plantedTrees}
            initialNumToRender={20}
            onEndReachedThreshold={0.1}
            renderItem={RenderItem}
            keyExtractor={(_, i) => i.toString()}
            ListEmptyComponent={EmptyContent}
            style={{flex: 1, backgroundColor: colors.khaki, minHeight: 300}}
            refreshing
            onEndReached={plantedLoadMore}
            onRefresh={refetchPlantedTrees}
            numColumns={calcTreeColumnNumber()}
            contentContainerStyle={styles.listScrollWrapper}
            refreshControl={
              isWeb() ? undefined : <RefreshControl refreshing={plantedRefetching} onRefresh={refetchPlantedTrees} />
            }
          />
        </PullToRefresh>
        <TreeColorsInfoModal visible={treeColorsModalVisible} onClose={() => setTreeColorModalVisible(false)} />
      </View>
    );
  };

  const renderNotVerifiedTrees = () => {
    return (
      <View style={{flex: 1}}>
        <Text style={[styles.treeLabel, {marginVertical: 20}]}>{t('notSubmittedTrees')}</Text>
        <PullToRefresh onRefresh={refetchTempTrees}>
          <FlatList
            // @ts-ignore
            data={tempTrees}
            renderItem={tempRenderItem}
            initialNumToRender={20}
            onEndReachedThreshold={0.1}
            onEndReached={tempLoadMore}
            keyExtractor={(_, i) => i.toString()}
            ListEmptyComponent={TempEmptyContent}
            style={{flex: 1, backgroundColor: colors.khaki, minHeight: 300}}
            refreshing
            onRefresh={refetchTempTrees}
            numColumns={calcTreeColumnNumber()}
            contentContainerStyle={styles.listScrollWrapper}
            refreshControl={
              isWeb() ? undefined : <RefreshControl refreshing={tempTreesRefetching} onRefresh={refetchTempTrees} />
            }
          />
        </PullToRefresh>
      </View>
    );
  };

  const renderOfflineTrees = (isPlanted: boolean) => {
    const prop = isPlanted ? 'planted' : 'updated';

    const renderItem = ({item, index}: {item: TreeJourney; index: number}) => {
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
      <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, globalStyles.screenView]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle title={t('treeInventory.title')} />
      <View
        style={[
          globalStyles.screenView,
          {
            paddingBottom: 40,
            paddingHorizontal: 12,
            flex: 1,
          },
        ]}
      >
        {renderLoadingModal()}
        <Spacer times={2} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listScrollWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  treeLabel: {
    alignSelf: 'center',
  },
  offlineTree: {
    width: 52,
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
  filterContainer: {
    alignItems: 'center',
  },
  filterWrapper: {
    flexDirection: 'row',
  },
});

export default Trees;
