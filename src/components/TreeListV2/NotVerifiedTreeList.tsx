import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {EmptyTreeList} from 'screens/GreenBlock/components/EmptyTreeList/EmptyTreeList';
import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {NotVerifiedTreeItem} from 'components/TreeListV2/NotVerifiedTreeItem';
import {NotVerifiedTree} from 'types';

export type NotVerifiedTreeListProps = {
  testID?: string;
  treeItemUI: TreeItemUI;
  setTreeItemUI: React.Dispatch<React.SetStateAction<TreeItemUI>>;
  notVerifiedTrees: NotVerifiedTree[] | undefined;
  refetching?: boolean;
  loading?: boolean;
  onRefetch?: () => void;
  onEndReached?: () => void;
};

export function NotVerifiedTreeList(props: NotVerifiedTreeListProps) {
  const {testID, notVerifiedTrees, treeItemUI, setTreeItemUI, loading, refetching, onRefetch, onEndReached} = props;

  const treeItemRenderItem = useCallback(
    ({item}: ListRenderItemInfo<NotVerifiedTree>) => {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <NotVerifiedTreeItem
            testID="tree-item-v2-cpt"
            withDetail={treeItemUI === TreeItemUI.WithDetail}
            tree={item}
            onPress={() => console.log('tree lllgogogo')}
          />
        </View>
      );
    },
    [treeItemUI],
  );

  const renderListWithDiffCol = useCallback(
    (col: number, testID?: string) => {
      return (
        <FlashList<NotVerifiedTree>
          testID={testID}
          data={notVerifiedTrees}
          estimatedItemSize={80}
          renderItem={treeItemRenderItem}
          showsVerticalScrollIndicator={false}
          numColumns={col}
          ItemSeparatorComponent={Spacer}
          keyExtractor={item => `list-${item._id}`}
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
    [refetching, onRefetch, onEndReached, treeItemRenderItem, notVerifiedTrees],
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
