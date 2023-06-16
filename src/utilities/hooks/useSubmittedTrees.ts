import {useWalletAccount} from 'ranger-redux/modules/web3/web3';
import {usePendingTreeIds} from 'ranger-redux/modules/trees/pendingTreeIds';
import {usePagination} from 'utilities/hooks/usePagination';
import {TreeLife} from 'utilities/helpers/treeInventory';
import planterTreeQuery, {
  PlanterTreesQueryQueryData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {Tree} from 'types';

export function useSubmittedTrees() {
  const walletAddress = useWalletAccount();

  const {pendingTreeIds} = usePendingTreeIds();

  console.log(pendingTreeIds);
  const {
    persistedData: submittedTrees,
    loading: submittedTreesLoading,
    refetchData: refetchSubmittedTrees,
    refetching: submittedTreesRefetching,
    loadMore: submittedTreesLoadMore,
  } = usePagination<PlanterTreesQueryQueryData, PlanterTreesQueryQueryData.Variables, Tree[]>(
    planterTreeQuery,
    {
      address: walletAddress.toString().toLocaleLowerCase(),
      pendingIds: pendingTreeIds && pendingTreeIds?.length > 0 ? pendingTreeIds : [''],
    },
    'trees',
    TreeLife.Submitted,
  );

  return {
    submittedTrees,
    pendingTreeIds,
    submittedTreesLoading,
    refetchSubmittedTrees,
    submittedTreesRefetching,
    submittedTreesLoadMore,
  };
}
