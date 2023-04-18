import React, {useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {FilterTabBar} from 'components/Filter/FilterTabBar';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {SearchButton} from 'screens/GreenBlock/components/SearchButton/SearchButton';
import {treeInventoryTabs, TreeLife, TreeStatus} from 'utilities/helpers/treeInventory';
import {DraftList} from 'components/Draft/DraftList';

export type TreeInventoryProps = {
  testID?: string;
  filter?: {
    tab?: TreeLife;
    situation?: TreeStatus;
  };
};

export function TreeInventory(props: TreeInventoryProps) {
  const {testID, filter} = props;

  const [activeTab, setActiveTab] = useState<TreeLife>(filter?.tab || TreeLife.Submitted);

  const {t} = useTranslation();

  return (
    <SafeAreaView testID={testID} style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle
        testID="screen-title-cpt"
        title={t('treeInventoryV2.titles.screen')}
        rightContent={<SearchButton testID="search-button-cpt" onPress={() => {}} />}
      />
      <View style={globalStyles.fill}>
        <View style={globalStyles.fill}>
          <View style={globalStyles.p1}>
            <FilterTabBar<TreeLife>
              testID="filter-tab-cpt"
              tabs={treeInventoryTabs}
              activeTab={activeTab}
              onChange={tab => setActiveTab(tab.title)}
            />
          </View>
          <Tabs testID="tab-context" style={globalStyles.fill} tab={activeTab}>
            <Tab testID="submitted-tab" tab={TreeLife.Submitted}>
              <View style={{padding: 20, backgroundColor: 'red'}}></View>
            </Tab>
            <Tab testID="drafted-tab" style={globalStyles.fill} tab={TreeLife.Drafted}>
              <DraftList testID="draft-list-cpt" />
            </Tab>
          </Tabs>
        </View>
      </View>
    </SafeAreaView>
  );
}
