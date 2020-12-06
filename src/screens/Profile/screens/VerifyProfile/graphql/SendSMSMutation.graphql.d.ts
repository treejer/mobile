import { DocumentNode } from "graphql-typed";
export namespace SendSMSMutationPartialData {
  export interface RequestSMS {
    __typename?: "ResponseWithMessage" | null;
    message?: string | null;
  }
}
export interface SendSMSMutationPartialData {
  requestSMS?: SendSMSMutationPartialData.RequestSMS | null;
}
export namespace SendSMSMutationData {
  export interface RequestSMS {
    __typename: "ResponseWithMessage";
    message?: string | null;
  }
}
export interface SendSMSMutationData {
  requestSMS?: SendSMSMutationData.RequestSMS | null;
}
declare const document: DocumentNode<SendSMSMutationData, never, SendSMSMutationPartialData>;
export default document;