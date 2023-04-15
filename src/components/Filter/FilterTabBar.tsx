import React from 'react';
import {StyleSheet, View} from 'react-native';

import {FilterTab} from 'components/Filter/FilterTab';

export type Tab = {title: string; icon?: string};
export type FilterTabProps = {
  testID?: string;
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: Tab) => void;
};

export function FilterTabBar(props: FilterTabProps) {
  const {testID, tabs, activeTab, onChange} = props;

  return (
    <View testID={testID} style={styles.tabBar}>
      {tabs.map(tab => (
        <FilterTab key={tab.title} tab={tab} onPress={() => onChange(tab)} isActive={tab.title === activeTab} />
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
