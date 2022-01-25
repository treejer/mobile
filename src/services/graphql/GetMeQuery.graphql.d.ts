import { DocumentNode } from "graphql-typed";
export namespace GetMeQueryPartialData {
  export interface User {
    __typename?: "User" | null;
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
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
  user?: GetMeQueryPartialData.User | null;
}
export namespace GetMeQueryData {
  export interface User {
    __typename: "User";
    id: string;
    firstName: string;
    lastName: string;
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
  user?: GetMeQueryData.User | null;
}
declare const document: DocumentNode<GetMeQueryData, never, GetMeQueryPartialData>;
export default document;