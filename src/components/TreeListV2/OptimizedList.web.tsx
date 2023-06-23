import React from 'react';
import {FlatList, ListRenderItemInfo, ViewStyle} from 'react-native';

import Spacer from 'components/Spacer';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';

export type OptimizedListProps<T> = {
  testID?: string;
  data: T[] | undefined | null;
  renderItem: ({item}: ListRenderItemInfo<T>) => JSX.Element;
  estimatedItemSize: number;
  loading?: boolean;
  onRefetch?: () => Promise<any>;
  refetching?: boolean;
  onEndReached?: () => void;
  col?: number;
  keyExtractor?: (item: T, index: number) => string;
  contentContainerStyle?: ViewStyle;
  ListEmptyComponent?: JSX.Element;
};

export function OptimizedList<T>(props: OptimizedListProps<T>) {
  const {
    testID,
    data,
    col,
    refetching,
    ListEmptyComponent,
    keyExtractor,
    onRefetch,
    onEndReached,
    renderItem,
    contentContainerStyle,
  } = props;

  return (
    <PullToRefresh onRefresh={onRefetch}>
      <FlatList<T>
        testID={testID}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        numColumns={col}
        ItemSeparatorComponent={Spacer}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        refreshing={refetching}
        onRefresh={onRefetch}
        onEndReached={onEndReached}
        onEndReachedThreshold={20}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={undefined}
      />
    </PullToRefresh>
  );
}
