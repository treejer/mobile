import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {FilterTabBar} from 'components/Filter/FilterTabBar';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {DraftList} from 'components/Draft/DraftList';
import Spacer from 'components/Spacer';
import {FilterTrees} from 'components/Filter/FilterTrees';
import {
  notVerifiedTreesButtons,
  NotVerifiedTreeStatus,
  submittedTreesButtons,
  SubmittedTreeStatus,
  treeInventoryTabs,
  TreeLife,
} from 'utilities/helpers/treeInventory';
import {useArrayFilter} from 'utilities/hooks/useArrayFilter';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {useSubmittedTrees} from 'utilities/hooks/useSubmittedTrees';
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

  const [activeTab, setActiveTab] = useState<TreeLife>(filter?.tab || TreeLife.Submitted);

  useEffect(() => {
    if (filter?.tab) {
      setActiveTab(filter?.tab);
    }
  }, [filter]);

  const [submittedTreeItemUI, setSubmittedTreeItemUI] = useState<TreeItemUI>(TreeItemUI.WithId);
  const [notVerifiedTreeItemUI, setNotVerifiedTreeItemUI] = useState<TreeItemUI>(TreeItemUI.WithId);

  const treeUpdateInterval = useTreeUpdateInterval();

  const {t} = useTranslation();

  const {filters: notVerifiedTreeFilters, handleSetFilter: handleSetFilterNotVerifiedTrees} =
    useArrayFilter<NotVerifiedTreeStatus>({
      defaultFilters:
        filter?.tab === TreeLife.NotVerified && filter?.notVerifiedStatus
          ? filter?.notVerifiedStatus
          : [NotVerifiedTreeStatus.Plant],
      canSelectMultiple: false,
      canDeSelectLastItem: false,
    });

  const [notVerifiedTreeFilter] = notVerifiedTreeFilters;

  const {planted, updated, assigned, current: notVerifiedTrees} = useNotVerifiedTrees(true, notVerifiedTreeFilter);

  console.log(notVerifiedTrees.trees, 'notVerifiedTrees is here');

  const {
    submittedTrees,
    submittedTreesRefetching,
    submittedTreesLoading,
    submittedTreesLoadMore,
    refetchSubmittedTrees,
  } = useSubmittedTrees();

  // const {
  //   filters: submittedTreeFilters,
  //   handleSetFilter: handleSetFilterSubmittedTrees,
  //   data: filteredSubmittedTrees,
  // } = useArrayFilter<SubmittedTreeStatus, Tree>({
  //   defaultFilters: filter?.tab === TreeLife.Submitted && filter?.submittedStatus ? filter?.submittedStatus : [],
  //   defaultData: submittedTrees,
  //   customFilterHandler: (data, filters) => handleFilterSubmittedTrees(data, filters, treeUpdateInterval),
  //   canSelectMultiple: false,
  // });

  useRefocusEffect(async () => {
    if (!submittedTreesLoading) {
      await refetchSubmittedTrees(undefined, !!submittedTrees?.length);
      notVerifiedTrees.dispatchRefetch();
    }
  });

  const notVerifiedTintColor = useMemo(
    () =>
      notVerifiedTreeFilter === NotVerifiedTreeStatus.Plant
        ? colors.yellow
        : notVerifiedTreeFilter === NotVerifiedTreeStatus.Update
        ? colors.pink
        : undefined,
    [notVerifiedTreeFilter],
  );

  return (
    <SafeAreaView testID={testID} style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle testID="screen-title-cpt" title={t('treeInventoryV2.titles.screen')} />
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
                filterList={submittedTreesButtons()}
                filters={[]}
                onFilter={() => {}}
                disabled={true}
              />
              <Spacer times={6} />
              <SubmittedTreeListV2
                testID="submitted-tree-list-v2"
                verifiedTrees={submittedTrees}
                treeItemUI={submittedTreeItemUI}
                setTreeItemUI={setSubmittedTreeItemUI}
                treeUpdateInterval={treeUpdateInterval}
                onRefetch={refetchSubmittedTrees}
                onEndReached={submittedTreesLoadMore}
                loading={submittedTreesLoading}
                refetching={submittedTreesRefetching}
              />
              <Spacer times={7} />
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
                tint={notVerifiedTintColor}
                notVerifiedTrees={notVerifiedTrees?.trees?.data}
                treeItemUI={notVerifiedTreeItemUI}
                setTreeItemUI={setNotVerifiedTreeItemUI}
                loading={notVerifiedTrees.loading && !notVerifiedTrees.refetching}
                refetching={notVerifiedTrees?.refetching && !notVerifiedTrees?.loading}
                onRefetch={notVerifiedTrees.dispatchRefetch}
                onEndReached={notVerifiedTrees.dispatchLoadMore}
              />
              <Spacer times={7} />
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
