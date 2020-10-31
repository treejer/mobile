import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import TabBar from 'components/TabBar';
import TreeSubmission from './TreeSubmission';
import Profile from './Profile';
import GreenBlock from './GreenBlock';
import {usePrivateKeyStorage} from 'services/web3';

const Tab = createBottomTabNavigator();

function MainTabs() {
  const {unlocked} = usePrivateKeyStorage();

  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        tabBarVisible: unlocked,
      }}
      initialRouteName="Profile"
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="TreeSubmission" component={TreeSubmission} />
      <Tab.Screen name="GreenBlock" component={GreenBlock} />
    </Tab.Navigator>
  );
}

export default MainTabs;
