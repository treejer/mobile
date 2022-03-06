import { DocumentNode } from "graphql-typed";
export namespace PlanterTreesQueryQueryPartialData {
  export interface TreesPlanter {
    __typename?: "planter" | null;
    id?: string | null;
  }
  export interface TreesFunder {
    __typename?: "TreeFunder" | null;
    id?: string | null;
  }
  export interface TreesTreeSpecsEntity {
    __typename?: "TreeSpecs" | null;
    id?: string | null;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    imageFs?: string | null;
    imageHash?: string | null;
    symbolFs?: string | null;
    symbolHash?: string | null;
    animationUrl?: string | null;
    diameter?: number | null;
    latitude?: string | null;
    longitude?: string | null;
    attributes?: string | null;
    updates?: string | null;
    nursery?: string | null;
    locations?: string | null;
  }
  export interface TreesLastUpdate {
    __typename?: "TreeUpdate" | null;
    id?: string | null;
    updateStatus?: number | null;
    updateSpecs?: string | null;
    createdAt?: number | null;
    updatedAt?: number | null;
  }
  export interface Trees {
    __typename?: "trees" | null;
    id?: string | null;
    treeSpecs?: string | null;
    planter?: PlanterTreesQueryQueryPartialData.TreesPlanter | null;
    funder?: PlanterTreesQueryQueryPartialData.TreesFunder | null;
    countryCode?: number | null;
    treeStatus?: string | null;
    plantDate?: string | null;
    birthDate?: string | null;
    saleType?: number | null;
    createdAt?: number | null;
    treeSpecsEntity?: PlanterTreesQueryQueryPartialData.TreesTreeSpecsEntity | null;
    lastUpdate?: PlanterTreesQueryQueryPartialData.TreesLastUpdate | null;
  }
}
export interface PlanterTreesQueryQueryPartialData {
  trees?: (PlanterTreesQueryQueryPartialData.Trees | null)[] | null;
}
export namespace PlanterTreesQueryQueryData {
  export interface Variables {
    address: string;
    first?: number | null;
    skip?: number | null;
  }
  export interface TreesPlanter {
    __typename: "planter";
    id: string;
  }
  export interface TreesFunder {
    __typename: "TreeFunder";
    id?: string | null;
  }
  export interface TreesTreeSpecsEntity {
    __typename: "TreeSpecs";
    id?: string | null;
    name?: string | null;
    description?: string | null;
    externalUrl?: string | null;
    imageFs?: string | null;
    imageHash?: string | null;
    symbolFs?: string | null;
    symbolHash?: string | null;
    animationUrl?: string | null;
    diameter?: number | null;
    latitude?: string | null;
    longitude?: string | null;
    attributes?: string | null;
    updates?: string | null;
    nursery?: string | null;
    locations?: string | null;
  }
  export interface TreesLastUpdate {
    __typename: "TreeUpdate";
    id?: string | null;
    updateStatus?: number | null;
    updateSpecs?: string | null;
    createdAt: number;
    updatedAt: number;
  }
  export interface Trees {
    __typename: "trees";
    id: string;
    treeSpecs: string;
    planter: PlanterTreesQueryQueryData.TreesPlanter;
    funder: PlanterTreesQueryQueryData.TreesFunder;
    countryCode?: number | null;
    treeStatus: string;
    plantDate?: string | null;
    birthDate?: string | null;
    saleType?: number | null;
    createdAt: number;
    treeSpecsEntity: PlanterTreesQueryQueryData.TreesTreeSpecsEntity;
    lastUpdate: PlanterTreesQueryQueryData.TreesLastUpdate;
  }
}
export interface PlanterTreesQueryQueryData {
  trees?: PlanterTreesQueryQueryData.Trees[] | null;
}
declare const document: DocumentNode<PlanterTreesQueryQueryData, PlanterTreesQueryQueryData.Variables, PlanterTreesQueryQueryPartialData>;
export default document;