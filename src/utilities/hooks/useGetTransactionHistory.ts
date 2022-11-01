import {usePagination} from 'utilities/hooks/usePagination';
import TransactionHistoryQuery, {
  GetTransactionHistoryQueryData,
  GetTransactionHistoryQueryPartialData,
} from 'screens/Withdraw/screens/WithrawHistory/graphql/getTransactionHistoryQuery.graphql';
import {TTransactionEvent} from 'components/Withdraw/TransactionItem';

export const TransactionHistory = 'TransactionHistory';

const all_events = [TTransactionEvent.TransferIn, TTransactionEvent.TransferOut];

export function useGetTransactionHistory(wallet: string, event_in?: TTransactionEvent[]) {
  return usePagination<
    GetTransactionHistoryQueryData,
    GetTransactionHistoryQueryData.Variables,
    GetTransactionHistoryQueryPartialData.Erc20Histories[]
  >(
    TransactionHistoryQuery,
    {
      address: wallet.toString().toLowerCase(),
      event_in: event_in?.length ? event_in : all_events,
    },
    'erc20Histories',
    TransactionHistory,
    true,
  );
}
