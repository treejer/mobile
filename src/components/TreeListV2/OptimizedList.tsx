import React from 'react';
import {ContentStyle, FlashList, ListRenderItemInfo} from '@shopify/flash-list';

import Spacer from 'components/Spacer';

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
  contentContainerStyle?: ContentStyle;
  ListEmptyComponent?: JSX.Element;
};

export function OptimizedList<T>(props: OptimizedListProps<T>) {
  const {
    testID,
    data,
    refetching,
    loading,
    renderItem,
    col,
    keyExtractor,
    contentContainerStyle,
    ListEmptyComponent,
    estimatedItemSize,
    onEndReached,
    onRefetch,
  } = props;

  return (
    <FlashList<T>
      testID={testID}
      estimatedItemSize={estimatedItemSize}
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      numColumns={col}
      ItemSeparatorComponent={Spacer}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      refreshing={refetching}
      onRefresh={onRefetch}
      onEndReached={!loading ? onEndReached : undefined}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
