import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import globalStyles from "../../styles";
import SelectWallet from "./screens/SelectWallet";
import VerifyProfile from "./screens/VerifyProfile";
import CreateWallet from "./screens/CreateWallet";
import NoWallet from "./screens/NoWallet";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName="NoWallet"
      screenOptions={{
        cardStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen name="NoWallet" component={NoWallet} />
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
