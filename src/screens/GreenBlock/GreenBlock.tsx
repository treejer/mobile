import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MyCommunity from './screens/MyCommunity';
import TreeDetails from './screens/TreeDetails';

const Stack = createStackNavigator();

function GreenBlock() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MyCommunity" component={MyCommunity} />
      <Stack.Screen name="TreeDetails" component={TreeDetails} />
    </Stack.Navigator>
  );
}

export default GreenBlock;
