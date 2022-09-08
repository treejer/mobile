import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Routes} from 'navigation';
import {Transfer} from 'screens/Withdraw/screens/Transfer/Transfer';

const WithdrawStack = createStackNavigator();

export function Withdraw() {
  return (
    <WithdrawStack.Navigator screenOptions={{headerShown: false}}>
      <WithdrawStack.Screen name={Routes.Transfer} component={Transfer} />
    </WithdrawStack.Navigator>
  );
}
