import React, {useCallback} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {ListRenderItemInfo} from '@shopify/flash-list';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import Spacer from 'components/Spacer';
import {SubmittedTreeItemV2} from 'components/TreeListV2/SubmittedTreeItemV2';
import {useAlertModal} from 'components/Common/AlertModalProvider';
import {OptimizedList} from 'components/OptimizedList/OptimizedList';
import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {EmptyTreeList} from 'screens/GreenBlock/components/EmptyTreeList/EmptyTreeList';
import {Routes} from 'navigation/Navigation';
import {Hex2Dec} from 'utilities/helpers/hex';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {Tree} from 'types';

export type SubmittedTreeListV2Props = {
  testID?: string;
  treeItemUI: TreeItemUI;
  setTreeItemUI: React.Dispatch<React.SetStateAction<TreeItemUI>>;
  verifiedTrees: Tree[] | null;
  treeUpdateInterval: number;
  refetching?: boolean;
  loading?: boolean;
  onRefetch?: () => Promise<any>;
  onEndReached?: () => void;
};

export function SubmittedTreeListV2(props: SubmittedTreeListV2Props) {
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

  const navigation = useNavigation();

  const {checkExistAnyDraftOfTree, dispatchRemoveDraftedJourney, dispatchSetDraftAsCurrentJourney} =
    useDraftedJourneys();
  const {dispatchStartPlantAssignedTree, dispatchClearJourney} = useCurrentJourney();

  const {openAlertModal, closeAlertModal} = useAlertModal();

  const handleNavigateToSubmission = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: Routes.TreeSubmission_V2,
            params: {
              initialRouteName: Routes.SubmitTree_V2,
            },
          },
        ],
      }),
    );
  }, [navigation]);

  const handleContinueDraftedJourney = useCallback(
    (id: string, reset: boolean) => {
      dispatchClearJourney();
      if (reset) {
        dispatchRemoveDraftedJourney({id});
      } else {
        dispatchSetDraftAsCurrentJourney({id});
      }
      closeAlertModal();
      handleNavigateToSubmission();
    },
    [
      dispatchRemoveDraftedJourney,
      dispatchSetDraftAsCurrentJourney,
      handleNavigateToSubmission,
      closeAlertModal,
      dispatchClearJourney,
    ],
  );

  const handlePressTree = useCallback(
    (tree: Tree) => {
      if (tree.id) {
        if (tree.treeStatus == 2) {
          if (checkExistAnyDraftOfTree(tree?.id)) {
            openAlertModal({
              title: {
                text: 'treeInventoryV2.existInDraft',
                tParams: {
                  id: Hex2Dec(tree?.id).toString(),
                },
                props: {
                  style: styles.modalTitle,
                },
              },
              buttons: [
                {
                  text: 'reset',
                  onPress: () => handleContinueDraftedJourney(tree?.id as string, true),
                  btnProps: {
                    style: styles.resetBtn,
                  },
                  textProps: {
                    style: styles.whiteText,
                  },
                },
                {
                  text: 'continue',
                  onPress: () => handleContinueDraftedJourney(tree?.id as string, false),
                  btnProps: {
                    style: styles.continueBtn,
                  },
                  textProps: {
                    style: styles.whiteText,
                  },
                },
              ],
            });
          } else {
            dispatchClearJourney();
            dispatchStartPlantAssignedTree({
              treeIdToPlant: tree?.id,
              tree: tree,
            });
            handleNavigateToSubmission();
          }
        } else if (tree?.treeStatus == 3) {
          showAlert({
            title: 'warning',
            message: 'notVerifiedTree',
            mode: AlertMode.Warning,
          });
        } else {
          //@ts-ignore
          navigation.navigate(Routes.TreeDetails, {tree: tree, tree_id: Hex2Dec(tree?.id).toString()});
        }
      }
    },
    [
      dispatchClearJourney,
      checkExistAnyDraftOfTree,
      navigation,
      openAlertModal,
      handleNavigateToSubmission,
      handleContinueDraftedJourney,
      dispatchStartPlantAssignedTree,
    ],
  );

  const treeItemRenderItem = useCallback(
    ({item}: ListRenderItemInfo<Tree>) => {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SubmittedTreeItemV2
            testID="tree-item-v2-cpt"
            withDetail={treeItemUI === TreeItemUI.WithDetail}
            treeUpdateInterval={treeUpdateInterval}
            tree={item}
            onPress={() => handlePressTree(item)}
          />
        </View>
      );
    },
    [treeItemUI, treeUpdateInterval, handlePressTree],
  );

  const renderListWithDiffCol = useCallback(
    (col: number, itemSize: number, testID?: string) => {
      return (
        <OptimizedList<Tree>
          testID={testID}
          col={col}
          data={verifiedTrees}
          estimatedItemSize={itemSize}
          renderItem={treeItemRenderItem}
          keyExtractor={(item, index) => `list-${item.id}-${col}-${index}`}
          contentContainerStyle={styles.list}
          refetching={!!refetching}
          loading={loading}
          onRefetch={onRefetch}
          onEndReached={onEndReached}
          ListEmptyComponent={<EmptyTreeList testID="empty-tree-list-cpt" />}
        />
      );
    },
    [refetching, loading, onRefetch, onEndReached, treeItemRenderItem, verifiedTrees],
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
