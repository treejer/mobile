import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ListRenderItemInfo} from '@shopify/flash-list';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {OptimizedList} from 'components/OptimizedList/OptimizedList';
import {NotVerifiedTreeItem} from 'components/TreeListV2/NotVerifiedTreeItem';
import {EmptyTreeList} from 'screens/GreenBlock/components/EmptyTreeList/EmptyTreeList';
import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {NotVerifiedTree} from 'types';
import {Routes} from 'navigation/Navigation';

export type NotVerifiedTreeListProps = {
  testID?: string;
  tint?: string;
  treeItemUI: TreeItemUI;
  setTreeItemUI: React.Dispatch<React.SetStateAction<TreeItemUI>>;
  notVerifiedTrees: NotVerifiedTree[] | undefined;
  refetching?: boolean;
  loading?: boolean;
  onRefetch?: () => Promise<any>;
  onEndReached?: () => void;
};

export function NotVerifiedTreeList(props: NotVerifiedTreeListProps) {
  const {testID, notVerifiedTrees, treeItemUI, setTreeItemUI, loading, refetching, onRefetch, onEndReached, tint} =
    props;

  const navigation = useNavigation();

  const handleNavigate = useCallback(
    (tree: NotVerifiedTree) => {
      //@ts-ignore
      navigation.navigate(Routes.NotVerifiedTreeDetails, {tree, tree_id: tree.treeId || tree.nonce});
    },
    [navigation],
  );

  const treeItemRenderItem = useCallback(
    ({item}: ListRenderItemInfo<NotVerifiedTree>) => {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <NotVerifiedTreeItem
            testID="tree-item-v2-cpt"
            withDetail={treeItemUI === TreeItemUI.WithDetail}
            tree={item}
            tint={tint}
            onPress={() => handleNavigate(item)}
          />
        </View>
      );
    },
    [treeItemUI, tint, handleNavigate],
  );

  const renderListWithDiffCol = useCallback(
    (col: number, itemSize: number, testID?: string) => {
      return (
        <OptimizedList<NotVerifiedTree>
          testID={testID}
          data={notVerifiedTrees}
          col={col}
          renderItem={treeItemRenderItem}
          estimatedItemSize={itemSize}
          keyExtractor={(item, index) => `list-${item._id}-${col}-${index}`}
          contentContainerStyle={styles.list}
          refetching={refetching}
          onRefetch={onRefetch}
          loading={loading}
          onEndReached={onEndReached}
          ListEmptyComponent={<EmptyTreeList testID="empty-tree-list-cpt" />}
        />
      );
    },
    [refetching, loading, onRefetch, onEndReached, treeItemRenderItem, notVerifiedTrees],
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

      {loading || (refetching && !notVerifiedTrees?.length) ? (
        <View style={[globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
          <ActivityIndicator testID="tree-list-v2-loading" color={colors.green} size="large" />
        </View>
      ) : (
        <Tabs testID="tab-trees-context" style={globalStyles.fill} tab={treeItemUI}>
          <Tab testID="withId-tab" style={styles.listContainer} tab={TreeItemUI.WithId}>
            {renderListWithDiffCol(4, 87, 'with-id-flatList')}
          </Tab>
          <Tab testID="withDetail-tab" style={styles.listContainer} tab={TreeItemUI.WithDetail}>
            {renderListWithDiffCol(2, 173, 'with-detail-flatList')}
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
  modalTitle: {
    fontSize: 12,
  },
  whiteText: {
    color: colors.white,
  },
  resetBtn: {
    backgroundColor: colors.yellow,
  },
  continueBtn: {
    backgroundColor: colors.green,
  },
});
