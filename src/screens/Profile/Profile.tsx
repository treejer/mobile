import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import globalStyles from "../../styles";
import SelectWallet from "./screens/SelectWallet";
import VerifyProfile from "./screens/VerifyProfile";

const Stack = createStackNavigator();

function Profile() {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: globalStyles.screenView }}>
      <Stack.Screen
        name="VerifyProfile"
        component={VerifyProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectWallet"
        component={SelectWallet}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default Profile;
