import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {storageKeys} from 'services/config';
import {useTreeFactory} from 'ranger-redux/modules/web3/web3';

export function useTreeUpdateInterval() {
  const [treeUpdateInterval, setTreeUpdateInterval] = useState(0);

  const treeFactory = useTreeFactory();

  const handleGetUpdateInterval = useCallback(() => {
    treeFactory.methods
      .treeUpdateInterval()
      .call()
      .then(async data => {
        setTreeUpdateInterval(data);
        try {
          await AsyncStorage.setItem(
            storageKeys.treeUpdateInterval,
            JSON.stringify({data, expireDate: new Date().setFullYear(new Date().getFullYear() + 1)}),
          );
        } catch (e) {}
      })
      .catch(e => console.log(e, 'e is here'));
  }, [treeFactory.methods]);

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
            handleGetUpdateInterval();
          }
        } else {
          handleGetUpdateInterval();
        }
      } catch (e) {}
    })();
  }, []);

  // useEffect(() => {}, [treeFactory.methods]);

  return treeUpdateInterval;
}
