import React, {useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {FilterTabBar} from 'components/Filter/FilterTabBar';
import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';
import {DraftList} from 'components/Draft/DraftList';
import {TreeListV2} from 'components/TreeListV2/TreeListV2';
import Spacer from 'components/Spacer';
import {FilterTrees} from 'components/Filter/FilterTrees';
import {SearchButton} from 'screens/GreenBlock/components/SearchButton/SearchButton';
import {SearchInInventory} from 'screens/GreenBlock/components/SearchInInventory/SearchInInventory';
import {useSearchValue} from 'utilities/hooks/useSearchValue';
import {treeInventoryTabs, TreeLife, TreeStatus} from 'utilities/helpers/treeInventory';
import {useArrayFilter} from 'utilities/hooks/useArrayFilter';

export type TreeInventoryProps = {
  testID?: string;
  filter?: {
    tab?: TreeLife;
    situation?: TreeStatus;
  };
};

export function TreeInventory(props: TreeInventoryProps) {
  const {testID, filter} = props;

  const [openSearchBox, setOpenSearchBox] = useState(false);
  const searchValue = useSearchValue();

  const [activeTab, setActiveTab] = useState<TreeLife>(filter?.tab || TreeLife.Submitted);
  const {filters: treeFilters, handleSetFilter: handleFilterTrees} = useArrayFilter<TreeStatus>();

  const {t} = useTranslation();

  const mockFilters = [
    {
      title: TreeStatus.Verified,
      count: 20,
      color: colors.green,
    },
    {
      title: TreeStatus.Pending,
      count: 15,
      color: colors.pink,
    },
    {
      title: TreeStatus.NotVerified,
      count: 20,
      color: colors.yellow,
    },
    {
      title: TreeStatus.Update,
      count: 42,
      color: colors.gray,
    },
  ];

  return (
    <SafeAreaView testID={testID} style={[globalStyles.screenView, globalStyles.fill]}>
      {openSearchBox ? (
        <SearchInInventory testID="search-in-inventory-cpt" {...searchValue} onClose={() => setOpenSearchBox(false)} />
      ) : (
        <ScreenTitle
          testID="screen-title-cpt"
          title={t('treeInventoryV2.titles.screen')}
          rightContent={<SearchButton testID="search-button-cpt" onPress={() => setOpenSearchBox(true)} />}
        />
      )}
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
            <Tab testID="submitted-tab" style={globalStyles.fill} tab={TreeLife.Submitted}>
              <FilterTrees
                testID="filter-trees-cpt"
                filterList={mockFilters}
                filters={treeFilters}
                onFilter={handleFilterTrees}
              />
              <Spacer times={6} />
              <TreeListV2 />
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
