import { DocumentNode } from "graphql-typed";
import { UpdateMobileInput } from "../../../../../data/schema/treejer_api-types";
export namespace UpdateMobileMutationPartialData {
  export interface UpdateMobile {
    __typename?: "ResponseWithMessage" | null;
    message?: string | null;
  }
}
export interface UpdateMobileMutationPartialData {
  updateMobile?: UpdateMobileMutationPartialData.UpdateMobile | null;
}
export namespace UpdateMobileMutationData {
  export interface Variables {
    input?: UpdateMobileInput | null;
  }
  export interface UpdateMobile {
    __typename: "ResponseWithMessage";
    message?: string | null;
  }
}
export interface UpdateMobileMutationData {
  updateMobile?: UpdateMobileMutationData.UpdateMobile | null;
}
declare const document: DocumentNode<UpdateMobileMutationData, UpdateMobileMutationData.Variables, UpdateMobileMutationPartialData>;
export default document;