import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';

import globalStyles from 'constants/styles';
import {EmptyList} from 'components/Common/EmptyList';
import {DraftItem} from 'components/Draft/DraftItem';
import Spacer from 'components/Spacer';
import {DraftedJourney, useDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {RenderIf} from 'components/Common/RenderIf';
import {ConflictDraftModal} from 'components/Draft/ConflictDraftModal';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Routes} from 'navigation/Navigation';

export type DraftListProps = {
  testID?: string;
};

export function DraftList(props: DraftListProps) {
  const {testID} = props;

  const navigation = useNavigation();

  const {
    drafts,
    conflict,
    dispatchSetDraftAsCurrentJourney,
    dispatchRemoveDraftedJourney,
    dispatchForceRemoveDraftedJourney,
    dispatchResolveConflict,
  } = useDraftedJourneys();

  const draftRenderItem = useCallback(
    ({item, index}: ListRenderItemInfo<DraftedJourney>) => {
      return (
        <>
          <DraftItem
            testID={`draft-item-${index}`}
            draft={item}
            onPressDraft={() => dispatchSetDraftAsCurrentJourney(item)}
            onRemoveDraft={() => dispatchRemoveDraftedJourney({id: item.id})}
          />
          <Spacer times={0.5} />
        </>
      );
    },
    [dispatchSetDraftAsCurrentJourney, dispatchRemoveDraftedJourney],
  );

  const handleForceRemoveDraftedJourney = useCallback(() => {
    dispatchForceRemoveDraftedJourney({id: conflict!});
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: Routes.SelectPlantType_V2}],
      }),
    );
  }, [navigation, dispatchForceRemoveDraftedJourney, conflict]);

  return (
    <>
      <RenderIf condition={!!conflict}>
        <ConflictDraftModal onCancel={dispatchResolveConflict} onAccept={handleForceRemoveDraftedJourney} />
      </RenderIf>
      <View testID={testID} style={styles.listContainer}>
        <FlashList<DraftedJourney>
          contentContainerStyle={styles.list}
          estimatedItemSize={68}
          testID="draft-list"
          data={drafts}
          renderItem={draftRenderItem}
          ItemSeparatorComponent={() => <Spacer times={2} />}
          ListEmptyComponent={EmptyList}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    width: '100%',
  },
  list: {
    paddingHorizontal: globalStyles.p1.padding,
    paddingBottom: globalStyles.p1.padding,
    paddingTop: 4,
  },
});
