import { DocumentNode } from "graphql-typed";
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
  export interface Apply {
    __typename: "ApplyMutationResponse";
    message?: string | null;
  }
}
export interface VerifyUserMutationData {
  apply?: VerifyUserMutationData.Apply | null;
}
declare const document: DocumentNode<VerifyUserMutationData, never, VerifyUserMutationPartialData>;
export default document;