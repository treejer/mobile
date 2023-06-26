import React from 'react';
import {ListRenderItemInfo, ViewStyle} from 'react-native';
import BigList from 'react-native-big-list';

import PullToRefresh from 'components/PullToRefresh/PullToRefresh';

export type OptimizedListProps<T> = {
  testID?: string;
  data: T[] | undefined;
  renderItem: ({item}: ListRenderItemInfo<T>) => JSX.Element;
  estimatedItemSize: number;
  loading?: boolean;
  onRefetch?: () => Promise<any>;
  refetching?: boolean;
  onEndReached?: () => void;
  col?: number;
  keyExtractor?: (item: T, index: number) => string;
  contentContainerStyle?: ViewStyle;
  ListEmptyComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | null
    | undefined;
  separate?: boolean;
};

function OptimizedListComponent<T>(props: OptimizedListProps<T>, ref: React.LegacyRef<BigList<T>>) {
  const {
    testID,
    data,
    col,
    refetching,
    ListEmptyComponent,
    keyExtractor,
    estimatedItemSize,
    renderItem,
    contentContainerStyle,
    onRefetch,
    onEndReached,
  } = props;

  return (
    <PullToRefresh onRefresh={onRefetch}>
      <BigList<T>
        renderHeader={() => <></>}
        renderFooter={() => <></>}
        testID={testID}
        ref={ref}
        data={data}
        itemHeight={estimatedItemSize}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        numColumns={col}
        keyExtractor={keyExtractor}
        contentContainerStyle={contentContainerStyle}
        refreshing={refetching}
        onRefresh={onRefetch}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={undefined}
        centerContent={!data || !data?.length}
      />
    </PullToRefresh>
  );
}

export const OptimizedList = React.forwardRef(OptimizedListComponent) as <T>(
  props: OptimizedListProps<T> & {ref?: React.LegacyRef<BigList<T>> | undefined},
) => ReturnType<typeof OptimizedListComponent>;
