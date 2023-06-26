import React, {forwardRef, LegacyRef} from 'react';
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
  ListEmptyComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
  separate?: boolean;
};

function OptimizedListComponent<T>(props: OptimizedListProps<T>, ref: React.LegacyRef<FlashList<T>>) {
  const {
    testID,
    data,
    refetching,
    renderItem,
    separate = true,
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
      ref={ref}
      estimatedItemSize={estimatedItemSize}
      data={data}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      numColumns={col}
      ItemSeparatorComponent={separate ? Spacer : undefined}
      keyExtractor={keyExtractor}
      contentContainerStyle={contentContainerStyle}
      refreshing={refetching}
      onRefresh={onRefetch}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

export const OptimizedList = React.forwardRef(OptimizedListComponent) as <T>(
  props: OptimizedListProps<T> & {ref?: React.LegacyRef<FlashList<T>> | undefined},
) => ReturnType<typeof OptimizedListComponent>;
