import { DocumentNode } from "graphql-typed";
export namespace TreeDetailsQueryQueryPartialData {
  export interface TreeUpdates {
    __typename?: "TreeUpdate" | null;
    id?: number | null;
    updateId?: number | null;
    treeId?: number | null;
    image?: string | null;
    status?: boolean | null;
    acceptedBy?: string | null;
    acceptedAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
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
    updates?: (TreeDetailsQueryQueryPartialData.TreeUpdates | null)[] | null;
  }
}
export interface TreeDetailsQueryQueryPartialData {
  tree?: TreeDetailsQueryQueryPartialData.Tree | null;
}
export namespace TreeDetailsQueryQueryData {
  export interface Variables {
    id: number;
  }
  export interface TreeUpdates {
    __typename: "TreeUpdate";
    id: number;
    updateId: number;
    treeId: number;
    image: string;
    status: boolean;
    acceptedBy?: string | null;
    acceptedAt?: string | null;
    createdAt: string;
    updatedAt: string;
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
    updates: (TreeDetailsQueryQueryData.TreeUpdates | null)[];
  }
}
export interface TreeDetailsQueryQueryData {
  tree?: TreeDetailsQueryQueryData.Tree | null;
}
declare const document: DocumentNode<TreeDetailsQueryQueryData, TreeDetailsQueryQueryData.Variables, TreeDetailsQueryQueryPartialData>;
export default document;