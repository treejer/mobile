import React from 'react';
import {View, StyleSheet} from 'react-native';
import {TreeStatus} from 'utilities/helpers/treeInventory';
import {FilterTreeButton} from 'components/Filter/FilterTreeButton';

export type FilterTree = {
  title: TreeStatus;
  count: number;
  color: string;
};

export type FilterTreesProps = {
  testID?: string;
  filterList: FilterTree[];
  filters: TreeStatus[];
  onFilter: (filter: TreeStatus) => void;
};

export function FilterTrees(props: FilterTreesProps) {
  const {testID, filterList, filters, onFilter} = props;

  return (
    <View testID={testID} style={styles.flexRow}>
      {filterList.map(filter => (
        <FilterTreeButton
          testID={`filter-tree-button-${filter.title}`}
          key={filter.title}
          isActive={filters.includes(filter.title)}
          tree={filter}
          onPress={() => onFilter(filter.title)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
