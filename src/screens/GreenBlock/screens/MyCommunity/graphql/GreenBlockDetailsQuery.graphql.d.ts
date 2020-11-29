import { DocumentNode } from "graphql-typed";
export namespace GreenBlockDetailsQueryQueryPartialData {
  export interface GBFactory {
    __typename?: "GBFactory" | null;
    greenBlock?: string | null;
  }
}
export interface GreenBlockDetailsQueryQueryPartialData {
  GBFactory?: GreenBlockDetailsQueryQueryPartialData.GBFactory | null;
}
export namespace GreenBlockDetailsQueryQueryData {
  export interface Variables {
    greenBlockId: string;
  }
  export interface GBFactory {
    __typename: "GBFactory";
    greenBlock?: string | null;
  }
}
export interface GreenBlockDetailsQueryQueryData {
  GBFactory?: GreenBlockDetailsQueryQueryData.GBFactory | null;
}
declare const document: DocumentNode<GreenBlockDetailsQueryQueryData, GreenBlockDetailsQueryQueryData.Variables, GreenBlockDetailsQueryQueryPartialData>;
export default document;