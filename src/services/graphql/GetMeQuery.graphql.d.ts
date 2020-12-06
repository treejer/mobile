import { DocumentNode } from "graphql-typed";
export namespace GetMeQueryPartialData {
  export interface Me {
    __typename?: "User" | null;
    id?: number | null;
    name?: string | null;
    email?: string | null;
    emailVerifiedAt?: string | null;
    idCard?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    mobile?: string | null;
    mobileCountry?: string | null;
    mobileVerifiedAt?: string | null;
    isVerified?: boolean | null;
  }
}
export interface GetMeQueryPartialData {
  me?: GetMeQueryPartialData.Me | null;
}
export namespace GetMeQueryData {
  export interface Me {
    __typename: "User";
    id: number;
    name: string;
    email: string;
    emailVerifiedAt?: string | null;
    idCard?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    mobile?: string | null;
    mobileCountry?: string | null;
    mobileVerifiedAt?: string | null;
    isVerified: boolean;
  }
}
export interface GetMeQueryData {
  me?: GetMeQueryData.Me | null;
}
declare const document: DocumentNode<GetMeQueryData, never, GetMeQueryPartialData>;
export default document;