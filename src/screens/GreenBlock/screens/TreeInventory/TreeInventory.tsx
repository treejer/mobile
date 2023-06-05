import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {FilterTabBar} from 'components/Filter/FilterTabBar';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {DraftList} from 'components/Draft/DraftList';
import Spacer from 'components/Spacer';
import {FilterTrees} from 'components/Filter/FilterTrees';
import {useSearchValue} from 'utilities/hooks/useSearchValue';
import {
  handleFilterSubmittedTrees,
  notVerifiedTreesButtons,
  NotVerifiedTreeStatus,
  submittedTreesButtons,
  SubmittedTreeStatus,
  treeInventoryTabs,
  TreeLife,
} from 'utilities/helpers/treeInventory';
import {useArrayFilter} from 'utilities/hooks/useArrayFilter';
import {usePagination} from 'utilities/hooks/usePagination';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import {submittedTreeStatusCount} from 'utilities/helpers/treeColorsV2';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import planterTreeQuery, {
  PlanterTreesQueryQueryData,
  PlanterTreesQueryQueryPartialData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {SearchButton} from 'screens/GreenBlock/components/SearchButton/SearchButton';
import {SearchInInventory} from 'screens/GreenBlock/components/SearchInInventory/SearchInInventory';
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';
import {SubmittedTreeListV2} from 'components/TreeListV2/SubmittedTreeListV2';
import {NotVerifiedTreeList} from 'components/TreeListV2/NotVerifiedTreeList';
import {useNotVerifiedTrees} from 'ranger-redux/modules/trees/useNotVerifiedTrees';

export enum TreeItemUI {
  WithDetail = 'WithDetail',
  WithId = 'WithId',
}

export type TreeInventoryProps = {
  testID?: string;
  filter?: {
    tab?: TreeLife;
    submittedStatus?: SubmittedTreeStatus[];
    notVerifiedStatus?: NotVerifiedTreeStatus[];
  };
};

export function TreeInventory(props: TreeInventoryProps) {
  const {testID, filter} = props;

  const [openSearchBox, setOpenSearchBox] = useState(false);
  const searchValue = useSearchValue();

  const [activeTab, setActiveTab] = useState<TreeLife>(filter?.tab || TreeLife.Submitted);

  useEffect(() => {
    if (filter?.tab) {
      setActiveTab(filter?.tab);
    }
  }, [filter]);

  const [submittedTreeItemUI, setSubmittedTreeItemUI] = useState<TreeItemUI>(TreeItemUI.WithId);
  const [notVerifiedTreeItemUI, setNotVerifiedTreeItemUI] = useState<TreeItemUI>(TreeItemUI.WithId);

  const walletAddress = useWalletAccount();
  const treeUpdateInterval = useTreeUpdateInterval();

  const {t} = useTranslation();

  const {
    persistedData: submittedTrees,
    loading: submittedTreesLoading,
    refetchData: refetchSubmittedTrees,
    refetching: submittedTreesRefetching,
    loadMore: submittedTreesLoadMore,
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

  const {filters: notVerifiedTreeFilters, handleSetFilter: handleSetFilterNotVerifiedTrees} =
    useArrayFilter<NotVerifiedTreeStatus>({
      defaultFilters:
        filter?.tab === TreeLife.NotVerified && filter?.notVerifiedStatus
          ? filter?.notVerifiedStatus
          : [NotVerifiedTreeStatus.Plant],
      canSelectMultiple: false,
      canDeSelectLastItem: false,
    });

  const {planted, updated, assigned, current: currentTrees} = useNotVerifiedTrees(notVerifiedTreeFilters[0]);

  const {
    filters: submittedTreeFilters,
    handleSetFilter: handleSetFilterSubmittedTrees,
    data: filteredSubmittedTrees,
  } = useArrayFilter<SubmittedTreeStatus, PlanterTreesQueryQueryPartialData.Trees>({
    defaultFilters: filter?.tab === TreeLife.Submitted && filter?.submittedStatus ? filter?.submittedStatus : [],
    defaultData: submittedTrees,
    customFilterHandler: (data, filters) => handleFilterSubmittedTrees(data, filters, treeUpdateInterval),
    canSelectMultiple: false,
  });

  console.log({filteredSubmittedTrees: filteredSubmittedTrees?.length, submittedTrees: submittedTrees?.length});

  useRefocusEffect(async () => {
    if (!submittedTreesLoading) {
      await refetchSubmittedTrees(undefined, !!submittedTrees?.length);
      currentTrees.dispatchRefetch();
    }
  });

  const submittedTreesCountOf = useMemo(
    () => submittedTreeStatusCount(submittedTrees, treeUpdateInterval),
    [submittedTrees, treeUpdateInterval],
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
              <FilterTrees<SubmittedTreeStatus>
                testID="filter-submitted-trees-cpt"
                filterList={submittedTreesButtons(submittedTreesCountOf)}
                filters={submittedTreeFilters}
                onFilter={handleSetFilterSubmittedTrees}
              />
              <Spacer times={6} />
              <SubmittedTreeListV2
                testID="submitted-tree-list-v2"
                verifiedTrees={filteredSubmittedTrees}
                treeItemUI={submittedTreeItemUI}
                setTreeItemUI={setSubmittedTreeItemUI}
                treeUpdateInterval={treeUpdateInterval}
                onRefetch={refetchSubmittedTrees}
                onEndReached={submittedTreesLoadMore}
                loading={submittedTreesLoading}
                refetching={submittedTreesRefetching}
              />
              <Spacer times={6} />
            </Tab>
            <Tab testID="notVerified-tab" style={globalStyles.fill} tab={TreeLife.NotVerified}>
              <FilterTrees<NotVerifiedTreeStatus>
                testID="filter-notVerified-trees-cpt"
                filterList={notVerifiedTreesButtons({
                  Plant: planted?.trees?.count || 0,
                  Update: updated?.trees?.count || 0,
                  Assigned: assigned?.trees?.count || 0,
                })}
                filters={notVerifiedTreeFilters}
                onFilter={handleSetFilterNotVerifiedTrees}
              />
              <Spacer times={6} />
              <NotVerifiedTreeList
                testID="notVerified-tree-list"
                notVerifiedTrees={currentTrees?.trees?.data}
                treeItemUI={notVerifiedTreeItemUI}
                setTreeItemUI={setNotVerifiedTreeItemUI}
                loading={currentTrees.loading && !currentTrees.refetching}
                refetching={currentTrees.refetching && !currentTrees.loading}
                onRefetch={currentTrees.dispatchRefetch}
                onEndReached={currentTrees.dispatchLoadMore}
              />
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
