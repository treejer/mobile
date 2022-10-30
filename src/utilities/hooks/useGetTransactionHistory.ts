import {usePagination} from 'utilities/hooks/usePagination';
import TransactionHistoryQuery, {
  GetTransactionHistoryQueryData,
  GetTransactionHistoryQueryPartialData,
} from 'screens/Withdraw/screens/WithrawHistory/graphql/getTransactionHistoryQuery.graphql';

export const TransactionHistory = 'TransactionHistory';

export function useGetTransactionHistory(wallet: string) {
  return usePagination<
    GetTransactionHistoryQueryData,
    GetTransactionHistoryQueryData.Variables,
    GetTransactionHistoryQueryPartialData.Erc20Histories[]
  >(
    TransactionHistoryQuery,
    {
      address: wallet.toString().toLowerCase(),
    },
    'erc20Histories',
    TransactionHistory,
    true,
  );
}
