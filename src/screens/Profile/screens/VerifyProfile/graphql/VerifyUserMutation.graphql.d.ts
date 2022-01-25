import { DocumentNode } from "graphql-typed";
import { VerifyMobileInput } from "../../../../../data/schema/treejer_api-types";
export namespace VerifyUserMutationPartialData {
  export interface Apply {
    __typename?: "ApplyMutationResponse" | null;
    message?: string | null;
  }
}
export interface VerifyUserMutationPartialData {
  apply?: VerifyUserMutationPartialData.Apply | null;
}
export namespace VerifyUserMutationData {
  export interface Variables {
    input?: VerifyMobileInput | null;
    userId?: string | null;
  }
  export interface Apply {
    __typename: "ApplyMutationResponse";
    message?: string | null;
  }
}
export interface VerifyUserMutationData {
  apply?: VerifyUserMutationData.Apply | null;
}
declare const document: DocumentNode<VerifyUserMutationData, VerifyUserMutationData.Variables, VerifyUserMutationPartialData>;
export default document;