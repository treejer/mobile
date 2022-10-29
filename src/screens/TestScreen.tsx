import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {isWeb} from 'utilities/helpers/web';
import {TransactionHistory} from 'components/Withdraw/TransactionHistory';
import {history} from 'screens/Withdraw/screens/WithrawHistory/WithdrawHistory';

type CounterType = {
  id: string;
  value: number;
  name: string;
};

const staticData: CounterType[] = [
  {
    id: '1',
    value: 0,
    name: 'name',
  },
  {
    id: '2',
    value: 0,
    name: 'name',
  },
  {
    id: '3',
    value: 0,
    name: 'name',
  },
  {
    id: '4',
    value: 0,
    name: 'name',
  },
  {
    id: '5',
    value: 0,
    name: 'name',
  },
];

export function TestScreen() {
  return <SafeAreaView style={{flex: 1}}>{/*<TransactionHistory history={history} />*/}</SafeAreaView>;
}
