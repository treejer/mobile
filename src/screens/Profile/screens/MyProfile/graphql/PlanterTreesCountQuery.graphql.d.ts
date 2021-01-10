import { DocumentNode } from "graphql-typed";
export namespace PlanterTreesCountQueryPartialData {
  export interface PlanterTreesCount {
    __typename?: "PlanterTreesCount" | null;
    count?: number | null;
  }
}
export interface PlanterTreesCountQueryPartialData {
  planterTreesCount?: PlanterTreesCountQueryPartialData.PlanterTreesCount | null;
}
export namespace PlanterTreesCountQueryData {
  export interface Variables {
    address: string;
  }
  export interface PlanterTreesCount {
    __typename: "PlanterTreesCount";
    count: number;
  }
}
export interface PlanterTreesCountQueryData {
  planterTreesCount?: PlanterTreesCountQueryData.PlanterTreesCount | null;
}
declare const document: DocumentNode<PlanterTreesCountQueryData, PlanterTreesCountQueryData.Variables, PlanterTreesCountQueryPartialData>;
export default document;