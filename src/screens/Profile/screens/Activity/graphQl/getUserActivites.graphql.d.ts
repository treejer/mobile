import { DocumentNode } from "graphql-typed";
export namespace GetUserActivitiesQueryPartialData {
  export interface AddressHistories {
    __typename?: "AddressHistories" | null;
    address?: string | null;
    blockNumber?: string | null;
    count?: string | null;
    createdAt?: string | null;
    event?: string | null;
    from?: string | null;
    id?: string | null;
    transactionHash?: string | null;
    type?: string | null;
    typeId?: string | null;
    value?: string | null;
  }
}
export interface GetUserActivitiesQueryPartialData {
  addressHistories?: (GetUserActivitiesQueryPartialData.AddressHistories | null)[] | null;
}
export namespace GetUserActivitiesQueryData {
  export interface Variables {
    address: string;
    event_in?: (string | null)[] | null;
  }
  export interface AddressHistories {
    __typename: "AddressHistories";
    address: string;
    blockNumber: string;
    count: string;
    createdAt: string;
    event: string;
    from: string;
    id: string;
    transactionHash: string;
    type: string;
    typeId: string;
    value: string;
  }
}
export interface GetUserActivitiesQueryData {
  addressHistories: GetUserActivitiesQueryData.AddressHistories[];
}
declare const document: DocumentNode<GetUserActivitiesQueryData, GetUserActivitiesQueryData.Variables, GetUserActivitiesQueryPartialData>;
export default document;