import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {isWeb} from 'utilities/helpers/web';

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
  const [counter, setCounter] = useState<CounterType[]>(staticData);

  useEffect(() => {
    console.log(counter, 'is here');
  }, [counter]);

  const handleIncrementCounter = () => {
    setCounter([
      ...counter,
      {
        id: Date.now().toString(),
        value: counter.length + 1,
        name: 'name',
      },
    ]);
  };

  const handleChangeName = (id: string) => {
    const cloneCounter = [...counter];
    const index = cloneCounter.findIndex(item => item.id === id);
    const selectedItem = {...cloneCounter[index]};
    selectedItem.name = 'name changed';
    cloneCounter[index] = selectedItem;
    setCounter(cloneCounter);
  };

  const renderItem = useCallback(
    ({item}) => {
      return (
        <View style={{height: 80}}>
          <Text>{item.value}</Text>
          <Text>{item.name}</Text>
          <TouchableOpacity onPress={() => handleChangeName(item.id)}>
            <Text>add</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [counter],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text>hello world</Text>
        <FlashList
          extraData={counter}
          data={counter}
          estimatedItemSize={80}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={handleIncrementCounter}
        />
      </View>
    </SafeAreaView>
  );
}
