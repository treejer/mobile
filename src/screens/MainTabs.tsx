import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SignUp from "./SignUp";
import TabBar from "../components/TabBar";
import Profile from "./Profile";

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="NewTree" component={SignUp} />
      <Tab.Screen name="GreenBlock" component={SignUp} />
    </Tab.Navigator>
  );
}

export default MainTabs;
