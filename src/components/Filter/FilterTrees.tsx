import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FilterTreeButton} from 'components/Filter/FilterTreeButton';

export type FilterTree<T> = {
  title: T;
  t: string;
  count?: number;
  color: string;
};

export type FilterTreesProps<T> = {
  testID?: string;
  filterList: FilterTree<T>[];
  filters: T[];
  onFilter: (filter: T) => void;
  disabled?: boolean;
};

export function FilterTrees<T>(props: FilterTreesProps<T>) {
  const {testID, filterList, filters, onFilter, disabled} = props;

  return (
    <View testID={testID} style={styles.flexRow}>
      {filterList.map(filter => (
        <FilterTreeButton<T>
          testID={`filter-tree-button-${filter.title}`}
          key={`filter-${filter.title}`}
          isActive={filters.includes(filter.title)}
          tree={filter}
          onPress={() => onFilter(filter.title)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    // paddingHorizontal: globalStyles.p2.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
});