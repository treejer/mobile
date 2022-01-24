import { DocumentNode } from "graphql-typed";
export namespace PlanterMinWithdrawableBalanceQueryQueryPartialData {
  export interface PlanterFund {
    __typename?: "PlanterFund" | null;
    balance?: string | null;
  }
}
export interface PlanterMinWithdrawableBalanceQueryQueryPartialData {
  PlanterFund?: PlanterMinWithdrawableBalanceQueryQueryPartialData.PlanterFund | null;
}
export namespace PlanterMinWithdrawableBalanceQueryQueryData {
  export interface PlanterFund {
    __typename: "PlanterFund";
    balance: string;
  }
}
export interface PlanterMinWithdrawableBalanceQueryQueryData {
  PlanterFund?: PlanterMinWithdrawableBalanceQueryQueryData.PlanterFund | null;
}
declare const document: DocumentNode<PlanterMinWithdrawableBalanceQueryQueryData, never, PlanterMinWithdrawableBalanceQueryQueryPartialData>;
export default document;