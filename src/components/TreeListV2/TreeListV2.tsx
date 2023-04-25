import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import Spacer from 'components/Spacer';
import {TreeItemV2} from 'components/TreeListV2/TreeItemV2';
import {PlanterTreesQueryQueryPartialData} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';

export type TreeListV2Props = {
  testID?: string;
  treeItemUI: TreeItemUI;
  setTreeItemUI: React.Dispatch<React.SetStateAction<TreeItemUI>>;
  verifiedTrees: PlanterTreesQueryQueryPartialData.Trees[] | null;
  treeUpdateInterval: number;
};

export function TreeListV2(props: TreeListV2Props) {
  const {testID, verifiedTrees, treeItemUI = TreeItemUI.WithId, setTreeItemUI, treeUpdateInterval} = props;

  const treeItemRenderItem = useCallback(
    ({item}: ListRenderItemInfo<PlanterTreesQueryQueryPartialData.Trees>) => {
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
      <Tabs testID="tab-trees-context" style={globalStyles.fill} tab={treeItemUI}>
        <Tab testID="withId-tab" style={styles.listContainer} tab={TreeItemUI.WithId}>
          <FlashList<PlanterTreesQueryQueryPartialData.Trees>
            testID="with-id-flatList"
            data={verifiedTrees}
            estimatedItemSize={80}
            renderItem={treeItemRenderItem}
            showsVerticalScrollIndicator={false}
            numColumns={4}
            ItemSeparatorComponent={Spacer}
            keyExtractor={item => `list-${item.id}`}
            centerContent
            contentContainerStyle={styles.list}
          />
        </Tab>
        <Tab testID="withDetail-tab" style={styles.listContainer} tab={TreeItemUI.WithDetail}>
          <FlashList<PlanterTreesQueryQueryPartialData.Trees>
            testID="with-detail-flatList"
            data={verifiedTrees}
            estimatedItemSize={176}
            renderItem={treeItemRenderItem}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            ItemSeparatorComponent={Spacer}
            keyExtractor={item => `list-${item.id}`}
            centerContent
            contentContainerStyle={styles.list}
          />
        </Tab>
      </Tabs>
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
