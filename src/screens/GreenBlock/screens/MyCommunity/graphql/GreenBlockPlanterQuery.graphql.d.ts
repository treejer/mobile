import { DocumentNode } from "graphql-typed";
export namespace GreenBlockPlanetQueryPartialData {
  export interface GBFactory {
    __typename?: "GBFactory" | null;
    planter?: string | null;
  }
}
export interface GreenBlockPlanetQueryPartialData {
  GBFactory?: GreenBlockPlanetQueryPartialData.GBFactory | null;
}
export namespace GreenBlockPlanetQueryData {
  export interface Variables {
    greenBlockId: string;
    userId: string;
  }
  export interface GBFactory {
    __typename: "GBFactory";
    planter?: string | null;
  }
}
export interface GreenBlockPlanetQueryData {
  GBFactory?: GreenBlockPlanetQueryData.GBFactory | null;
}
declare const document: DocumentNode<GreenBlockPlanetQueryData, GreenBlockPlanetQueryData.Variables, GreenBlockPlanetQueryPartialData>;
export default document;