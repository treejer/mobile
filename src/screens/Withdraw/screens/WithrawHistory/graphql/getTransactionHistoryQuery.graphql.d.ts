import { DocumentNode } from "graphql-typed";
export namespace GetTransactionHistoryQueryPartialData {
  export interface Erc20Histories {
    __typename?: "transactionHistoryResponse" | null;
    id?: string | null;
    address?: string | null;
    amount?: number | null;
    token?: string | null;
    from?: string | null;
    to?: string | null;
    event?: string | null;
    transactionHash?: string | null;
    blockNumber?: number | null;
    createdAt?: number | null;
  }
}
export interface GetTransactionHistoryQueryPartialData {
  erc20Histories?: (GetTransactionHistoryQueryPartialData.Erc20Histories | null)[] | null;
}
export namespace GetTransactionHistoryQueryData {
  export interface Variables {
    token: string;
    address: string;
    skip?: number | null;
    first?: number | null;
  }
  export interface Erc20Histories {
    __typename: "transactionHistoryResponse";
    id: string;
    address: string;
    amount: number;
    token: string;
    from: string;
    to: string;
    event: string;
    transactionHash: string;
    blockNumber: number;
    createdAt: number;
  }
}
export interface GetTransactionHistoryQueryData {
  erc20Histories?: GetTransactionHistoryQueryData.Erc20Histories[] | null;
}
declare const document: DocumentNode<GetTransactionHistoryQueryData, GetTransactionHistoryQueryData.Variables, GetTransactionHistoryQueryPartialData>;
export default document;