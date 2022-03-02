import globalStyles from 'constants/styles';

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {usePrivateKeyStorage} from 'services/web3';
import {ProfileRouteParamList} from 'types';
import SelectOnMapVerifyProfile from 'screens/Profile/screens/SelectOnMapVerifyProfile';
import VerifyPending from 'screens/Profile/screens/VerifyPending';

import VerifyProfile from './screens/VerifyProfile';
import CreateWallet from './screens/CreateWallet';
import NoWallet from './screens/NoWallet';
import MyProfile from './screens/MyProfile';
import OfflineMap from 'screens/Profile/screens/OfflineMap';
import SavedAreas from 'screens/Profile/screens/SavedAreas';
import SelectOnMap from 'screens/TreeSubmission/screens/SelectOnMap';
import SelectLanguage from 'screens/Onboarding/screens/SelectLanguage';
import SettingsScreen from 'screens/Profile/screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator<ProfileRouteParamList>();
const RootStack = createNativeStackNavigator();

function ProfileStack() {
  const {unlocked} = usePrivateKeyStorage();
  const initialRoute = unlocked ? 'MyProfile' : 'NoWallet';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        contentStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen name="NoWallet" component={NoWallet} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="OfflineMap" component={OfflineMap} />
      <Stack.Screen name="SavedAreas" component={SavedAreas} />
      <Stack.Screen name="VerifyProfile" component={VerifyProfile} />
      <Stack.Screen name="SelectOnMapVerifyProfile" component={SelectOnMapVerifyProfile} />
      <Stack.Screen name="VerifyPending" component={VerifyPending} />
      <Stack.Screen name="SelectOnMap" component={SelectOnMap} />
      <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="MainProfile" component={ProfileStack} />
      <RootStack.Screen name="CreateWallet" component={CreateWallet} />
    </RootStack.Navigator>
  );
}

export default Profile;
