import { DocumentNode } from "graphql-typed";
export namespace GetPlantingModelsQueryQueryPartialData {
  export interface ModelsPlanter {
    __typename?: "planter" | null;
    id?: string | null;
  }
  export interface Models {
    __typename?: "Models" | null;
    id?: string | null;
    planter?: GetPlantingModelsQueryQueryPartialData.ModelsPlanter | null;
    price?: number | null;
    country?: number | null;
    lastFund?: number | null;
    lastPlant?: number | null;
    status?: number | null;
    start?: number | null;
    lastReservePlant?: number | null;
    createdAt?: number | null;
    updatedAt?: number | null;
  }
}
export interface GetPlantingModelsQueryQueryPartialData {
  models?: (GetPlantingModelsQueryQueryPartialData.Models | null)[] | null;
}
export namespace GetPlantingModelsQueryQueryData {
  export interface Variables {
    planter: string;
  }
  export interface ModelsPlanter {
    __typename: "planter";
    id: string;
  }
  export interface Models {
    __typename: "Models";
    id: string;
    planter: GetPlantingModelsQueryQueryData.ModelsPlanter;
    price: number;
    country: number;
    lastFund: number;
    lastPlant: number;
    status: number;
    start: number;
    lastReservePlant: number;
    createdAt: number;
    updatedAt: number;
  }
}
export interface GetPlantingModelsQueryQueryData {
  models?: (GetPlantingModelsQueryQueryData.Models | null)[] | null;
}
declare const document: DocumentNode<GetPlantingModelsQueryQueryData, GetPlantingModelsQueryQueryData.Variables, GetPlantingModelsQueryQueryPartialData>;
export default document;