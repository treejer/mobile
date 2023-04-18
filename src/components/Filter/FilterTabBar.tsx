import React from 'react';
import {StyleSheet, View} from 'react-native';

import {FilterTab} from 'components/Filter/FilterTab';

export type Tab<T> = {title: T; icon?: string};
export type FilterTabProps<T> = {
  testID?: string;
  tabs: Tab<T>[];
  activeTab: string;
  onChange: (tab: Tab<T>) => void;
};

export function FilterTabBar<T>(props: FilterTabProps<T>) {
  const {testID, tabs, activeTab, onChange} = props;

  return (
    <View testID={testID} style={styles.tabBar}>
      {tabs.map(tab => (
        <FilterTab
          testID={`tab-${tab.title}-button`}
          key={`${tab.title}`}
          tab={tab}
          onPress={() => onChange(tab)}
          isActive={tab.title === activeTab}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
