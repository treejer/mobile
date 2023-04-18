import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';

import globalStyles from 'constants/styles';
import {EmptyList} from 'components/Common/EmptyList';
import {DraftItem} from 'components/Draft/DraftItem';
import Spacer from 'components/Spacer';
import {DraftedJourney, useDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

export type DraftListProps = {
  testID?: string;
};

export function DraftList(props: DraftListProps) {
  const {testID} = props;

  const {drafts, dispatchSetDraftAsCurrentJourney} = useDraftedJourneys();

  const draftRenderItem = useCallback(
    ({item, index}: ListRenderItemInfo<DraftedJourney>) => {
      return (
        <>
          <DraftItem
            testID={`draft-item-${index}`}
            draft={item}
            onPress={() => dispatchSetDraftAsCurrentJourney(item)}
          />
          <Spacer times={0.5} />
        </>
      );
    },
    [dispatchSetDraftAsCurrentJourney],
  );

  return (
    <View testID={testID} style={{flex: 1, width: '100%'}}>
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
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: globalStyles.p1.padding,
    paddingBottom: globalStyles.p1.padding,
    paddingTop: 4,
  },
});
