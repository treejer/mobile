import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {FilterTabBar} from 'components/Filter/FilterTabBar';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {DraftList} from 'components/Draft/DraftList';
import {TreeListV2} from 'components/TreeListV2/TreeListV2';
import Spacer from 'components/Spacer';
import {FilterTrees} from 'components/Filter/FilterTrees';
import {useSearchValue} from 'utilities/hooks/useSearchValue';
import {treeInventoryTabs, TreeLife, TreeStatus} from 'utilities/helpers/treeInventory';
import {useArrayFilter} from 'utilities/hooks/useArrayFilter';
import {usePagination} from 'utilities/hooks/usePagination';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import {treeStatusCount} from 'utilities/helpers/treeColorsV2';
import planterTreeQuery, {
  PlanterTreesQueryQueryData,
  PlanterTreesQueryQueryPartialData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {SearchButton} from 'screens/GreenBlock/components/SearchButton/SearchButton';
import {SearchInInventory} from 'screens/GreenBlock/components/SearchInInventory/SearchInInventory';
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';

export enum TreeItemUI {
  WithDetail = 'WithDetail',
  WithId = 'WithId',
}

export type TreeInventoryProps = {
  testID?: string;
  filter?: {
    tab?: TreeLife;
    situation?: TreeStatus;
  };
};

export function TreeInventory(props: TreeInventoryProps) {
  const {testID, filter} = props;

  const [openSearchBox, setOpenSearchBox] = useState(false);
  const searchValue = useSearchValue();

  const [activeTab, setActiveTab] = useState<TreeLife>(filter?.tab || TreeLife.Submitted);
  const {filters: treeFilters, handleSetFilter: handleFilterTrees} = useArrayFilter<TreeStatus>();
  const [treeItemUI, setTreeItemUI] = useState<TreeItemUI>(TreeItemUI.WithId);

  const walletAddress = useWalletAccount();

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
      address: walletAddress.toString().toLocaleLowerCase(),
    },
    'trees',
    TreeLife.Submitted,
  );

  console.log(plantedTrees, 'plantedTreess ish shehehre');

  const treeUpdateInterval = useTreeUpdateInterval();

  const {t} = useTranslation();

  const treeCountOf = useMemo(
    () => treeStatusCount(plantedTrees, treeUpdateInterval),
    [plantedTrees, treeUpdateInterval],
  );

  const filterButtons = useMemo(
    () => [
      {
        title: TreeStatus.Verified,
        count: treeCountOf?.Verified,
        color: colors.green,
      },
      {
        title: TreeStatus.Pending,
        count: treeCountOf?.Pending,
        color: colors.pink,
      },
      {
        title: TreeStatus.NotVerified,
        count: treeCountOf?.NotVerified,
        color: colors.yellow,
      },
      {
        title: TreeStatus.Update,
        count: treeCountOf?.Update,
        color: colors.gray,
      },
    ],
    [treeCountOf],
  );

  return (
    <SafeAreaView testID={testID} style={[globalStyles.screenView, globalStyles.fill]}>
      {openSearchBox ? (
        <SearchInInventory testID="search-in-inventory-cpt" {...searchValue} onClose={() => setOpenSearchBox(false)} />
      ) : (
        <ScreenTitle
          testID="screen-title-cpt"
          title={t('treeInventoryV2.titles.screen')}
          rightContent={<SearchButton testID="search-button-cpt" onPress={() => setOpenSearchBox(true)} />}
        />
      )}
      <View style={globalStyles.fill}>
        <View style={globalStyles.fill}>
          <View style={globalStyles.p1}>
            <FilterTabBar<TreeLife>
              testID="filter-tab-cpt"
              tabs={treeInventoryTabs}
              activeTab={activeTab}
              onChange={tab => setActiveTab(tab.title)}
            />
          </View>
          <Tabs testID="tab-context" style={globalStyles.fill} tab={activeTab}>
            <Tab testID="submitted-tab" style={globalStyles.fill} tab={TreeLife.Submitted}>
              <FilterTrees
                testID="filter-trees-cpt"
                filterList={filterButtons}
                filters={treeFilters}
                onFilter={handleFilterTrees}
              />
              <Spacer times={6} />
              <TreeListV2
                testID="tree-list-v2"
                verifiedTrees={plantedTrees}
                treeItemUI={treeItemUI}
                setTreeItemUI={setTreeItemUI}
                treeUpdateInterval={treeUpdateInterval}
              />
              <Spacer times={6} />
            </Tab>
            <Tab testID="drafted-tab" style={globalStyles.fill} tab={TreeLife.Drafted}>
              <DraftList testID="draft-list-cpt" />
            </Tab>
          </Tabs>
        </View>
      </View>
    </SafeAreaView>
  );
}
