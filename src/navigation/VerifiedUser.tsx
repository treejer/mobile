import React from 'react';
import {BottomTabScreenProps as LibraryProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Routes} from './Navigation';
import TabBar from 'components/TabBar/TabBar';
import MyProfile from 'screens/Profile/screens/MyProfile/MyProfile';
import {Withdraw} from 'screens/Withdraw/Withdraw';
import TreeSubmission from 'screens/TreeSubmission';
import GreenBlock from 'screens/GreenBlock/GreenBlock';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {usePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';

export type VerifiedUserNavigationParamList = {
  [Routes.MyProfile]?: {
    hideVerification?: boolean;
    unVerified?: boolean;
  };
  [Routes.TreeSubmission]: undefined;
  [Routes.GreenBlock]: undefined;
  [Routes.Withdraw]: undefined;
};

export type VerifiedUserNavigationProp<ScreenName extends keyof VerifiedUserNavigationParamList> = LibraryProp<
  VerifiedUserNavigationParamList,
  ScreenName
>;

const VerifiedUserStack = createBottomTabNavigator<VerifiedUserNavigationParamList>();

export function VerifiedUserNavigation() {
  const plantTreePermissions = usePlantTreePermissions();
  return (
    <VerifiedUserStack.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{headerShown: false}}>
      <VerifiedUserStack.Screen
        name={Routes.MyProfile}
        component={MyProfile}
        options={{title: screenTitle('Profile')}}
      />
      <VerifiedUserStack.Screen name={Routes.TreeSubmission}>
        {props => <TreeSubmission {...props} plantTreePermissions={plantTreePermissions} />}
      </VerifiedUserStack.Screen>
      <VerifiedUserStack.Screen name={Routes.GreenBlock} component={GreenBlock} />
      <VerifiedUserStack.Screen name={Routes.Withdraw} component={Withdraw} />
    </VerifiedUserStack.Navigator>
  );
}
