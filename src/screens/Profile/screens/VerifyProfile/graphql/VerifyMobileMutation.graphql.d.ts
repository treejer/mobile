import { DocumentNode } from "graphql-typed";
export namespace VerifyMobileMutationPartialData {
  export interface VerifyMobile {
    __typename?: "ResponseWithMessage" | null;
    message?: string | null;
  }
}
export interface VerifyMobileMutationPartialData {
  verifyMobile?: VerifyMobileMutationPartialData.VerifyMobile | null;
}
export namespace VerifyMobileMutationData {
  export interface Variables {
    token: string;
  }
  export interface VerifyMobile {
    __typename: "ResponseWithMessage";
    message?: string | null;
  }
}
export interface VerifyMobileMutationData {
  verifyMobile?: VerifyMobileMutationData.VerifyMobile | null;
}
declare const document: DocumentNode<VerifyMobileMutationData, VerifyMobileMutationData.Variables, VerifyMobileMutationPartialData>;
export default document;