import React from 'react';
import {createNativeStackNavigator, NativeStackScreenProps as LibraryProp} from '@react-navigation/native-stack';
import {Routes} from './navigation';
import MyProfile from 'screens/Profile/screens/MyProfile';
import VerifyProfile from 'screens/Profile/screens/VerifyProfile';
import SelectOnMapVerifyProfile from 'screens/Profile/screens/SelectOnMapVerifyProfile';
import VerifyPending from 'screens/Profile/screens/VerifyPending';
import {PlanterJoinJourney} from 'types';
import {GetMeQueryPartialData} from 'services/graphql/GetMeQuery.graphql';
import {TestScreen} from 'screens/TestScreen';

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
  [Routes.Test]: undefined;
};

export type UnVerifiedUserNavigationProp<ScreenName extends keyof UnVerifiedUserNavigationParamList> = LibraryProp<
  UnVerifiedUserNavigationParamList,
  ScreenName
>;

export const UnVerifiedUserStack = createNativeStackNavigator<UnVerifiedUserNavigationParamList>();

export function UnVerifiedUserNavigation() {
  return (
    <UnVerifiedUserStack.Navigator screenOptions={{headerShown: false}}>
      {/*<UnVerifiedUserStack.Screen name={Routes.Test} component={TestScreen} />*/}
      <UnVerifiedUserStack.Screen name={Routes.MyProfile} component={MyProfile} />
      <UnVerifiedUserStack.Screen name={Routes.VerifyProfile} component={VerifyProfile} />
      <UnVerifiedUserStack.Screen name={Routes.SelectOnMapVerifyProfile} component={SelectOnMapVerifyProfile} />
      <UnVerifiedUserStack.Screen name={Routes.VerifyPending} component={VerifyPending} />
    </UnVerifiedUserStack.Navigator>
  );
}
