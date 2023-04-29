import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import Spacer from 'components/Spacer';
import {TreeItemV2} from 'components/TreeListV2/TreeItemV2';
import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {EmptyTreeList} from 'screens/GreenBlock/components/EmptyTreeList./EmptyTreeList';
import {TreeInList} from 'types';

export type TreeListV2Props = {
  testID?: string;
  treeItemUI: TreeItemUI;
  setTreeItemUI: React.Dispatch<React.SetStateAction<TreeItemUI>>;
  verifiedTrees: TreeInList[] | null;
  treeUpdateInterval: number;
  refetching?: boolean;
  loading?: boolean;
  onRefetch?: () => void;
  onEndReached?: () => void;
};

export function TreeListV2(props: TreeListV2Props) {
  const {
    testID,
    verifiedTrees,
    treeItemUI = TreeItemUI.WithId,
    setTreeItemUI,
    treeUpdateInterval,
    refetching,
    loading,
    onRefetch,
    onEndReached,
  } = props;

  const treeItemRenderItem = useCallback(
    ({item}: ListRenderItemInfo<TreeInList>) => {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TreeItemV2
            testID="tree-item-v2-cpt"
            withDetail={treeItemUI === TreeItemUI.WithDetail}
            treeUpdateInterval={treeUpdateInterval}
            tree={item}
          />
        </View>
      );
    },
    [treeItemUI, treeUpdateInterval],
  );

  const renderListWithDiffCol = useCallback(
    (col: number, testID?: string) => {
      return (
        <FlashList<TreeInList>
          testID={testID}
          data={verifiedTrees}
          estimatedItemSize={80}
          renderItem={treeItemRenderItem}
          showsVerticalScrollIndicator={false}
          numColumns={col}
          ItemSeparatorComponent={Spacer}
          keyExtractor={item => `list-${item.id}`}
          centerContent
          contentContainerStyle={styles.list}
          refreshing={refetching}
          onRefresh={onRefetch}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={<EmptyTreeList testID="empty-tree-list-cpt" />}
        />
      );
    },
    [refetching, onRefetch, onEndReached, treeItemRenderItem, verifiedTrees],
  );

  return (
    <View testID={testID} style={styles.container}>
      <View testID="select-tree-item-size" style={styles.sizeContainer}>
        <TouchableOpacity testID="small-size-button" onPress={() => setTreeItemUI(TreeItemUI.WithId)}>
          <Fa5Icon
            testID="small-size-icon"
            name="th"
            color={treeItemUI === TreeItemUI.WithId ? colors.green : colors.grayLight}
            size={36}
          />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity testID="big-size-button" onPress={() => setTreeItemUI(TreeItemUI.WithDetail)}>
          <Fa5Icon
            testID="big-size-icon"
            name="th-large"
            color={treeItemUI === TreeItemUI.WithDetail ? colors.green : colors.grayLight}
            size={36}
          />
        </TouchableOpacity>
      </View>
      <Spacer times={4} />
      {loading || (refetching && !verifiedTrees?.length) ? (
        <View style={[globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
          <ActivityIndicator testID="tree-list-v2-loading" color={colors.green} size="large" />
        </View>
      ) : (
        <Tabs testID="tab-trees-context" style={globalStyles.fill} tab={treeItemUI}>
          <Tab testID="withId-tab" style={styles.listContainer} tab={TreeItemUI.WithId}>
            {renderListWithDiffCol(4, 'with-id-flatList')}
          </Tab>
          <Tab testID="withDetail-tab" style={styles.listContainer} tab={TreeItemUI.WithDetail}>
            {renderListWithDiffCol(2, 'with-detail-flatList')}
          </Tab>
        </Tabs>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: globalStyles.p1.padding,
  },
  sizeContainer: {
    ...globalStyles.flexRow,
    justifyContent: 'flex-end',
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  list: {
    paddingTop: 4,
    paddingBottom: 8,
  },
});
