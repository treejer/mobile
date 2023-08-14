import React from 'react';
import {BottomTabScreenProps as LibraryProp, createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Routes} from './Navigation';
import MyProfile from 'screens/Profile/screens/MyProfile/MyProfile';
import {Activity} from 'screens/Profile/screens/Activity/Activity';
import GreenBlock from 'screens/GreenBlock/GreenBlock';
import {Withdraw} from 'screens/Withdraw/Withdraw';
import TreeSubmissionV2 from 'screens/TreeSubmissionV2';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {TreeLife, SubmittedTreeStatus, NotVerifiedTreeStatus} from 'utilities/helpers/treeInventory';
import {usePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import TabBar from 'components/TabBar/TabBar';

export type VerifiedUserNavigationParamList = {
  [Routes.MyProfile]?: {
    hideVerification?: boolean;
    unVerified?: boolean;
  };
  [Routes.TreeSubmission]: undefined;
  [Routes.TreeSubmission_V2]: undefined;
  [Routes.GreenBlock]: {
    greenBlockIdToJoin?: string;
    shouldNavigateToTreeDetails: boolean;
    filter?: TreeFilter;
    tabFilter?: TreeLife;
    submittedFilter?: SubmittedTreeStatus[];
    notVerifiedFilter?: NotVerifiedTreeStatus[];
  };
  [Routes.Withdraw]: undefined;
  [Routes.Activity]?: {
    filters: string[];
  };
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
      <VerifiedUserStack.Screen name={Routes.TreeSubmission_V2}>
        {props => <TreeSubmissionV2 {...props} plantTreePermissions={plantTreePermissions} />}
      </VerifiedUserStack.Screen>
      <VerifiedUserStack.Screen name={Routes.GreenBlock} component={GreenBlock} />
      <VerifiedUserStack.Screen name={Routes.Withdraw} component={Withdraw} />
      <VerifiedUserStack.Screen name={Routes.Activity} component={Activity} />
    </VerifiedUserStack.Navigator>
  );
}
