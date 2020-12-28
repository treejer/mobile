import { DocumentNode } from "graphql-typed";
export namespace TreeDetailsQueryQueryPartialData {
  export interface Tree {
    __typename?: "Tree" | null;
    id?: number | null;
    treeId?: string | null;
    gbId?: number | null;
    typeId?: number | null;
    owner?: string | null;
    planter?: string | null;
    name?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    plantedDate?: string | null;
    birthDate?: string | null;
    fundedDate?: string | null;
    height?: number | null;
    diameter?: number | null;
    ambassadorBalance?: number | null;
    planterBalance?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
}
export interface TreeDetailsQueryQueryPartialData {
  tree?: TreeDetailsQueryQueryPartialData.Tree | null;
}
export namespace TreeDetailsQueryQueryData {
  export interface Variables {
    id: number;
  }
  export interface Tree {
    __typename: "Tree";
    id: number;
    treeId: string;
    gbId: number;
    typeId?: number | null;
    owner?: string | null;
    planter?: string | null;
    name: string;
    latitude: number;
    longitude: number;
    plantedDate: string;
    birthDate: string;
    fundedDate?: string | null;
    height?: number | null;
    diameter?: number | null;
    ambassadorBalance?: number | null;
    planterBalance?: number | null;
    createdAt: string;
    updatedAt: string;
  }
}
export interface TreeDetailsQueryQueryData {
  tree?: TreeDetailsQueryQueryData.Tree | null;
}
declare const document: DocumentNode<TreeDetailsQueryQueryData, TreeDetailsQueryQueryData.Variables, TreeDetailsQueryQueryPartialData>;
export default document;