import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Routes} from 'navigation/index';
import {TransferScreen} from 'screens/Withdraw/screens/Transfer/TransferScreen';
import {WithdrawHistoryScreen} from 'screens/Withdraw/screens/WithrawHistory/TransactionHistory';

const WithdrawStack = createStackNavigator();

export function Withdraw() {
  return (
    <WithdrawStack.Navigator screenOptions={{headerShown: false}}>
      <WithdrawStack.Screen name={Routes.Transfer} component={TransferScreen} />
      <WithdrawStack.Screen name={Routes.WithdrawHistory} component={WithdrawHistoryScreen} />
    </WithdrawStack.Navigator>
  );
}
