import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {storageKeys} from 'services/config';
import {useTreeFactory} from 'ranger-redux/modules/web3/web3';

export function useTreeUpdateInterval() {
  const [treeUpdateInterval, setTreeUpdateInterval] = useState(0);

  const treeFactory = useTreeFactory();

  const handleGetUpdateInterval = useCallback(async () => {
    try {
      const newTreeUpdateInterval = await treeFactory.methods.treeUpdateInterval().call();
      setTreeUpdateInterval(newTreeUpdateInterval);
      await AsyncStorage.setItem(
        storageKeys.treeUpdateInterval,
        JSON.stringify({data: newTreeUpdateInterval, expireDate: new Date().setFullYear(new Date().getFullYear() + 1)}),
      );
    } catch (e: any) {
      console.log(e, 'error in get update interval');
    }
  }, [treeFactory?.methods]);

  useEffect(() => {
    (async function () {
      try {
        const persistedValue = await AsyncStorage.getItem(storageKeys.treeUpdateInterval);
        if (persistedValue) {
          const {data, expireDate} = JSON.parse(persistedValue);

          console.log({data, expireDate}, 'persisted data for update interval');

          if (Date.now() < expireDate) {
            setTreeUpdateInterval(Number(data));
          } else {
            await AsyncStorage.removeItem(storageKeys.treeUpdateInterval);
            await handleGetUpdateInterval();
          }
        } else {
          await handleGetUpdateInterval();
        }
      } catch (e) {
        console.log(e, 'error in read update interval from async storage');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return treeUpdateInterval;
}
