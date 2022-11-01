import React from 'react';
import {createStackNavigator, StackScreenProps as LibraryProp} from '@react-navigation/stack';

import {Routes} from './Navigation';
import MyProfile from 'screens/Profile/screens/MyProfile';
import VerifyProfile from 'screens/Profile/screens/VerifyProfile';
import VerifyPending from 'screens/Profile/screens/VerifyPending';
import SelectOnMapVerifyProfile from 'screens/Profile/screens/SelectOnMapVerifyProfile';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {GetMeQueryPartialData} from 'services/graphql/GetMeQuery.graphql';
import {PlanterJoinJourney} from 'types';

export type UnVerifiedUserNavigationParamList = {
  [Routes.MyProfile]?: {
    hideVerification?: boolean;
    unVerified?: boolean;
  };
  [Routes.VerifyProfile]?: {
    journey?: PlanterJoinJourney;
  };
  [Routes.SelectOnMapVerifyProfile]?: {
    journey?: PlanterJoinJourney;
  };
  [Routes.VerifyPending]?: {
    user: GetMeQueryPartialData.User;
  };
};

export type UnVerifiedUserNavigationProp<ScreenName extends keyof UnVerifiedUserNavigationParamList> = LibraryProp<
  UnVerifiedUserNavigationParamList,
  ScreenName
>;

export const UnVerifiedUserStack = createStackNavigator<UnVerifiedUserNavigationParamList>();

export function UnVerifiedUserNavigation() {
  return (
    <UnVerifiedUserStack.Navigator screenOptions={{headerShown: false, animationEnabled: true}}>
      <UnVerifiedUserStack.Screen
        name={Routes.MyProfile}
        component={MyProfile}
        options={{title: screenTitle('Profile')}}
      />
      <UnVerifiedUserStack.Screen
        name={Routes.VerifyProfile}
        component={VerifyProfile}
        options={{title: screenTitle('Verify Profile')}}
      />
      <UnVerifiedUserStack.Screen
        name={Routes.SelectOnMapVerifyProfile}
        component={SelectOnMapVerifyProfile}
        options={{title: screenTitle('Your Location')}}
      />
      <UnVerifiedUserStack.Screen
        name={Routes.VerifyPending}
        component={VerifyPending}
        options={{title: screenTitle('Verify Pending')}}
      />
    </UnVerifiedUserStack.Navigator>
  );
}
