import { DocumentNode } from "graphql-typed";
export namespace GreenBlockQueryQueryPartialData {
  export interface GBFactory {
    __typename?: "GBFactory" | null;
    greenBlockId?: string | null;
  }
}
export interface GreenBlockQueryQueryPartialData {
  GBFactory?: GreenBlockQueryQueryPartialData.GBFactory | null;
}
export namespace GreenBlockQueryQueryData {
  export interface Variables {
    address: string;
  }
  export interface GBFactory {
    __typename: "GBFactory";
    greenBlockId?: string | null;
  }
}
export interface GreenBlockQueryQueryData {
  GBFactory?: GreenBlockQueryQueryData.GBFactory | null;
}
declare const document: DocumentNode<GreenBlockQueryQueryData, GreenBlockQueryQueryData.Variables, GreenBlockQueryQueryPartialData>;
export default document;