import {useCallback} from 'react';
import {changeNetwork, createWeb3, resetWeb3Data, storeMagicToken} from '../../redux/modules/web3/web3';
import {BlockchainNetwork} from 'services/config';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {Account} from 'web3-core';

export function useUserWeb3() {
  const web3 = useAppSelector(state => state.web3);
  const dispatch = useAppDispatch();

  const handleCreateWeb3 = useCallback(() => {
    dispatch(createWeb3());
  }, [dispatch]);

  const handleChangeNetwork = useCallback(
    (newNetwork: BlockchainNetwork) => {
      dispatch(changeNetwork(newNetwork));
    },
    [dispatch],
  );

  const handleResetWeb3Data = useCallback(() => {
    dispatch(resetWeb3Data());
  }, [dispatch]);

  const handleStoreMagicToken = useCallback(
    (magicToken: string) => {
      dispatch(storeMagicToken({web3: web3.web3, magicToken}));
    },
    [dispatch, web3],
  );

  return {
    ...web3,
    changeNetwork: handleChangeNetwork,
    resetWeb3Data: handleResetWeb3Data,
    storeMagicToken: handleStoreMagicToken,
    createWeb3: handleCreateWeb3,
  };
}

export const useWeb3 = () => useAppSelector(state => state.web3.web3);
export const useConfig = () => useAppSelector(state => state.web3.config);
export const useMagic = () => useAppSelector(state => state.web3.magic);
export const useWalletWeb3 = () => useAppSelector(state => state.web3.web3);
export const useTreeFactory = () => useAppSelector(state => state.web3.treeFactory);
export const usePlanter = () => useAppSelector(state => state.web3.planter);
export const usePlanterFund = () => useAppSelector(state => state.web3.planterFund);

export const useWalletAccount = (): string => {
  return useAppSelector(state => state.web3.wallet);
};
export const useWalletAccountTorus = (): Account | null => {
  const web3 = useWeb3();
  return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
};
export const useAccessToken = () => useAppSelector(state => state.web3.accessToken);
export const useUserId = () => useAppSelector(state => state.web3.userId);
