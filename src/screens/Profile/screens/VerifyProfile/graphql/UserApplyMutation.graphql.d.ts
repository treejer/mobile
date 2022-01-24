import { DocumentNode } from "graphql-typed";
import { ApplyInput } from "../../../../../data/schema/treejer_api-types";
export namespace UserApplyMutationPartialData {
  export interface Apply {
    __typename?: "ApplyMutationResponse" | null;
    message?: string | null;
  }
}
export interface UserApplyMutationPartialData {
  apply?: UserApplyMutationPartialData.Apply | null;
}
export namespace UserApplyMutationData {
  export interface Variables {
    input?: ApplyInput | null;
    userId?: string | null;
  }
  export interface Apply {
    __typename: "ApplyMutationResponse";
    message?: string | null;
  }
}
export interface UserApplyMutationData {
  apply?: UserApplyMutationData.Apply | null;
}
declare const document: DocumentNode<UserApplyMutationData, UserApplyMutationData.Variables, UserApplyMutationPartialData>;
export default document;