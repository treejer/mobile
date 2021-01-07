import { DocumentNode } from "graphql-typed";
import { Web3Result } from "../../../../../schema/treejer_api-types";
export namespace PlanterWithdrawableBalanceQueryQueryPartialData {
  export interface TreeFactory {
    __typename?: "TreeFactory" | null;
    balance?: Web3Result | null;
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
    balance?: Web3Result | null;
  }
}
export interface PlanterWithdrawableBalanceQueryQueryData {
  TreeFactory?: PlanterWithdrawableBalanceQueryQueryData.TreeFactory | null;
}
declare const document: DocumentNode<PlanterWithdrawableBalanceQueryQueryData, PlanterWithdrawableBalanceQueryQueryData.Variables, PlanterWithdrawableBalanceQueryQueryPartialData>;
export default document;