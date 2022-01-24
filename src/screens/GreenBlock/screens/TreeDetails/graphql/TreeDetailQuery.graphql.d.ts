import { DocumentNode } from "graphql-typed";
export namespace TreeDetailQueryQueryPartialData {
  export interface TreePlanter {
    __typename?: "planter" | null;
    id?: string | null;
  }
  export interface TreeFunder {
    __typename?: "TreeFunder" | null;
    id?: string | null;
  }
  export interface TreeTreeSpecsEntity {
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
  }
  export interface TreeLastUpdate {
    __typename?: "TreeUpdate" | null;
    id?: string | null;
    updateStatus?: number | null;
    updateSpecs?: string | null;
    createdAt?: number | null;
    updatedAt?: number | null;
  }
  export interface Tree {
    __typename?: "Tree" | null;
    id?: string | null;
    planter?: TreeDetailQueryQueryPartialData.TreePlanter | null;
    funder?: TreeDetailQueryQueryPartialData.TreeFunder | null;
    countryCode?: number | null;
    treeStatus?: number | null;
    plantDate?: string | null;
    birthDate?: string | null;
    saleType?: number | null;
    treeSpecsEntity?: TreeDetailQueryQueryPartialData.TreeTreeSpecsEntity | null;
    lastUpdate?: TreeDetailQueryQueryPartialData.TreeLastUpdate | null;
  }
}
export interface TreeDetailQueryQueryPartialData {
  tree?: TreeDetailQueryQueryPartialData.Tree | null;
}
export namespace TreeDetailQueryQueryData {
  export interface Variables {
    id: string;
  }
  export interface TreePlanter {
    __typename: "planter";
    id: string;
  }
  export interface TreeFunder {
    __typename: "TreeFunder";
    id?: string | null;
  }
  export interface TreeTreeSpecsEntity {
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
  }
  export interface TreeLastUpdate {
    __typename: "TreeUpdate";
    id?: string | null;
    updateStatus?: number | null;
    updateSpecs?: string | null;
    createdAt: number;
    updatedAt: number;
  }
  export interface Tree {
    __typename: "Tree";
    id?: string | null;
    planter: TreeDetailQueryQueryData.TreePlanter;
    funder: TreeDetailQueryQueryData.TreeFunder;
    countryCode?: number | null;
    treeStatus?: number | null;
    plantDate?: string | null;
    birthDate?: string | null;
    saleType?: number | null;
    treeSpecsEntity: TreeDetailQueryQueryData.TreeTreeSpecsEntity;
    lastUpdate: TreeDetailQueryQueryData.TreeLastUpdate;
  }
}
export interface TreeDetailQueryQueryData {
  tree?: TreeDetailQueryQueryData.Tree | null;
}
declare const document: DocumentNode<TreeDetailQueryQueryData, TreeDetailQueryQueryData.Variables, TreeDetailQueryQueryPartialData>;
export default document;