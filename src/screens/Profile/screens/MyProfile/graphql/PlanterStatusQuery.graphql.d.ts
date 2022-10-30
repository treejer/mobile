import { DocumentNode } from "graphql-typed";
export namespace PlanterStatusQueryQueryPartialData {
  export interface Planter {
    __typename?: "planter" | null;
    status?: string | null;
    id?: string | null;
    countryCode?: string | null;
    planterType?: string | null;
    plantedCount?: number | null;
    balance?: number | null;
    supplyCap?: number | null;
    balanceProjected?: number | null;
  }
}
export interface PlanterStatusQueryQueryPartialData {
  planter?: PlanterStatusQueryQueryPartialData.Planter | null;
}
export namespace PlanterStatusQueryQueryData {
  export interface Variables {
    id: string;
  }
  export interface Planter {
    __typename: "planter";
    status: string;
    id: string;
    countryCode?: string | null;
    planterType: string;
    plantedCount: number;
    balance: number;
    supplyCap: number;
    balanceProjected: number;
  }
}
export interface PlanterStatusQueryQueryData {
  planter?: PlanterStatusQueryQueryData.Planter | null;
}
declare const document: DocumentNode<PlanterStatusQueryQueryData, PlanterStatusQueryQueryData.Variables, PlanterStatusQueryQueryPartialData>;
export default document;