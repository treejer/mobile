import { DocumentNode } from "graphql-typed";
import { Date } from "../../../../../schema/treejer_api-types";
export namespace TreesQueryQueryPartialData {
  export interface TreesTreesData {
    __typename?: "Tree" | null;
    treeId?: string | null;
    gbId?: number | null;
    typeId?: number | null;
    owner?: string | null;
    planter?: string | null;
    name?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    plantedDate?: Date | null;
    birthDate?: Date | null;
    fundedDate?: Date | null;
    height?: number | null;
    diameter?: number | null;
    ambassadorBalance?: number | null;
    planterBalance?: number | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }
  export interface TreesTrees {
    __typename?: "TreeEdges" | null;
    current_page?: number | null;
    data?: (TreesQueryQueryPartialData.TreesTreesData | null)[] | null;
  }
  export interface Trees {
    __typename?: "TreesResponse" | null;
    trees?: TreesQueryQueryPartialData.TreesTrees | null;
  }
}
export interface TreesQueryQueryPartialData {
  trees?: TreesQueryQueryPartialData.Trees | null;
}
export namespace TreesQueryQueryData {
  export interface Variables {
    address: string;
    limit?: number | null;
  }
  export interface TreesTreesData {
    __typename: "Tree";
    treeId: string;
    gbId: number;
    typeId?: number | null;
    owner?: string | null;
    planter?: string | null;
    name: string;
    latitude: number;
    longitude: number;
    plantedDate: Date;
    birthDate: Date;
    fundedDate?: Date | null;
    height?: number | null;
    diameter?: number | null;
    ambassadorBalance?: number | null;
    planterBalance?: number | null;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface TreesTrees {
    __typename: "TreeEdges";
    current_page: number;
    data: (TreesQueryQueryData.TreesTreesData | null)[];
  }
  export interface Trees {
    __typename: "TreesResponse";
    trees?: TreesQueryQueryData.TreesTrees | null;
  }
}
export interface TreesQueryQueryData {
  trees?: TreesQueryQueryData.Trees | null;
}
declare const document: DocumentNode<TreesQueryQueryData, TreesQueryQueryData.Variables, TreesQueryQueryPartialData>;
export default document;