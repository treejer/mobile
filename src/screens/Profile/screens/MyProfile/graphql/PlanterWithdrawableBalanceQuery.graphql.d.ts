import { DocumentNode } from "graphql-typed";
export namespace PlanterWithdrawableBalanceQueryQueryPartialData {
  export interface TreeFactory {
    __typename?: "TreeFactory" | null;
    balance?: string | null;
  }
}
export interface PlanterWithdrawableBalanceQueryQueryPartialData {
  TreeFactory?: PlanterWithdrawableBalanceQueryQueryPartialData.TreeFactory | null;
}
export namespace PlanterWithdrawableBalanceQueryQueryData {
  export interface Variables {
    address: string;
  }
  export interface TreeFactory {
    __typename: "TreeFactory";
    balance: string;
  }
}
export interface PlanterWithdrawableBalanceQueryQueryData {
  TreeFactory?: PlanterWithdrawableBalanceQueryQueryData.TreeFactory | null;
}
declare const document: DocumentNode<PlanterWithdrawableBalanceQueryQueryData, PlanterWithdrawableBalanceQueryQueryData.Variables, PlanterWithdrawableBalanceQueryQueryPartialData>;
export default document;