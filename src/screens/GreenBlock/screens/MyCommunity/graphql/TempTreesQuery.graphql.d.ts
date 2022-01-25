import { DocumentNode } from "graphql-typed";
export namespace TempTreesQueryQueryPartialData {
  export interface TempTreesPlanter {
    __typename?: "planter" | null;
    id?: string | null;
  }
  export interface TempTrees {
    __typename?: "tempTrees" | null;
    id?: string | null;
    planter?: (TempTreesQueryQueryPartialData.TempTreesPlanter | null)[] | null;
    status?: string | null;
    birthDate?: string | null;
    treeSpecs?: string | null;
    createdAt?: number | null;
  }
}
export interface TempTreesQueryQueryPartialData {
  tempTrees?: (TempTreesQueryQueryPartialData.TempTrees | null)[] | null;
}
export namespace TempTreesQueryQueryData {
  export interface Variables {
    address: string;
    first?: number | null;
    skip?: number | null;
  }
  export interface TempTreesPlanter {
    __typename: "planter";
    id: string;
  }
  export interface TempTrees {
    __typename: "tempTrees";
    id: string;
    planter: (TempTreesQueryQueryData.TempTreesPlanter | null)[];
    status: string;
    birthDate: string;
    treeSpecs: string;
    createdAt: number;
  }
}
export interface TempTreesQueryQueryData {
  tempTrees?: TempTreesQueryQueryData.TempTrees[] | null;
}
declare const document: DocumentNode<TempTreesQueryQueryData, TempTreesQueryQueryData.Variables, TempTreesQueryQueryPartialData>;
export default document;