import {useTreeFactory} from 'services/web3';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storageKeys} from 'services/config';

export function useTreeUpdateInterval() {
  const [treeUpdateInterval, setTreeUpdateInterval] = useState(0);

  const treeFactory = useTreeFactory();

  useEffect(() => {
    (async function () {
      try {
        const persistedValue = await AsyncStorage.getItem(storageKeys.treeUpdateInterval);
        if (persistedValue) {
          setTreeUpdateInterval(Number(persistedValue));
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    treeFactory.methods
      .treeUpdateInterval()
      .call()
      .then(async data => {
        setTreeUpdateInterval(data);
        try {
          await AsyncStorage.setItem(storageKeys.treeUpdateInterval, data);
        } catch (e) {}
      })
      .catch(e => console.log(e, 'e is here'));
  }, [treeFactory.methods]);

  return treeUpdateInterval;
}
