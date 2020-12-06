import { DocumentNode } from "graphql-typed";
import { Web3Result } from "../../../../../schema/treejer_api-types";
export namespace GreenBlockDetailsQueryQueryPartialData {
  export interface GBFactory {
    __typename?: "GBFactory" | null;
    greenBlock?: Web3Result | null;
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
    greenBlock?: Web3Result | null;
  }
}
export interface GreenBlockDetailsQueryQueryData {
  GBFactory?: GreenBlockDetailsQueryQueryData.GBFactory | null;
}
declare const document: DocumentNode<GreenBlockDetailsQueryQueryData, GreenBlockDetailsQueryQueryData.Variables, GreenBlockDetailsQueryQueryPartialData>;
export default document;