import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import globalStyles from 'constants/styles';
import SelectWallet from './screens/SelectWallet';
import VerifyProfile from './screens/VerifyProfile';
import CreateWallet from './screens/CreateWallet';
import NoWallet from './screens/NoWallet';
import {usePrivateKeyStorage} from 'services/web3';
import MyProfile from './screens/MyProfile';

export type ProfileRouteParamList = {
  NoWallet: undefined,
  MyProfile: undefined,
  VerifyProfile: undefined;
  SelectWallet: undefined,
};

const Stack = createStackNavigator<ProfileRouteParamList>();
const RootStack = createStackNavigator();

function ProfileStack() {
  const {unlocked} = usePrivateKeyStorage();

  return (
    <Stack.Navigator
      initialRouteName={unlocked ? 'MyProfile' : 'NoWallet'}
      screenOptions={{
        cardStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen name="NoWallet" component={NoWallet} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="VerifyProfile" component={VerifyProfile} />
      <Stack.Screen name="SelectWallet" component={SelectWallet} />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <RootStack.Navigator mode="modal" headerMode="none">
      <RootStack.Screen name="MainProfile" component={ProfileStack} />
      <RootStack.Screen name="CreateWallet" component={CreateWallet} />
    </RootStack.Navigator>
  );
}

export default Profile;
