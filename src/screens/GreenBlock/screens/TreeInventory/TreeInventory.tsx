import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {FilterTabBar, Tab} from 'components/Filter/FilterTabBar';
import {SearchButton} from 'screens/GreenBlock/components/SearchButton/SearchButton';
import {treeInventoryTabs, TreeLife, TreeSituation} from 'utilities/helpers/treeInventory';

export type TreeInventoryProps = {
  testID?: string;
  filter?: {
    tab?: TreeLife;
    situation?: TreeSituation;
  };
};

export function TreeInventory(props: TreeInventoryProps) {
  const {testID, filter} = props;

  const [activeTab, setActiveTab] = useState<string>(filter?.tab || treeInventoryTabs[0]?.title);

  const {t} = useTranslation();

  return (
    <SafeAreaView testID={testID} style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle
        testID="screen-title-cpt"
        title={t('treeInventoryV2.titles.screen')}
        rightContent={<SearchButton testID="search-button-cpt" onPress={() => {}} />}
      />
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]} showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.p1]}>
          <FilterTabBar
            testID="filter-tab-cpt"
            tabs={treeInventoryTabs}
            activeTab={activeTab}
            onChange={(tab: Tab) => setActiveTab(tab.title)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
