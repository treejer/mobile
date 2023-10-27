import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {storageKeys} from 'services/config';
import {useAccessRestriction, useWalletAccount, useWalletWeb3} from 'ranger-redux/modules/web3/web3';

export function useUserRole() {
  const [hasRole, setHasRole] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const accessRestriction = useAccessRestriction();

  const address = useWalletAccount();
  const web3 = useWalletWeb3();

  const handleCheckHasRole = useCallback(async () => {
    try {
      const b = new Buffer('PLANTER_ROLE');
      const roleHash = web3.utils.keccak256(b.toString());
      const hasRole = await accessRestriction?.methods?.hasRole(roleHash, address).call();
      setHasRole(!!hasRole);
      await AsyncStorage.setItem(
        storageKeys.hasRole,
        JSON.stringify({data: hasRole, expireDate: new Date().setFullYear(new Date().getFullYear() + 1)}),
      );
    } catch (e: any) {
      console.log(e, 'error in check has role');
    }
  }, [accessRestriction.methods, address, web3.utils]);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const persistedValue = await AsyncStorage.getItem(storageKeys.hasRole);
        if (persistedValue) {
          const {data, expireDate} = JSON.parse(persistedValue);

          console.log({data, expireDate}, 'persisted data for has role');

          if (Date.now() < expireDate) {
            setHasRole(!!data);
          } else {
            await AsyncStorage.removeItem(storageKeys.hasRole);
            await handleCheckHasRole();
          }
        } else {
          await handleCheckHasRole();
        }
      } catch (e) {
        console.log(e, 'error in read has role from async storage');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    hasRole,
    loading,
  };
}
