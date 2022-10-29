import { DocumentNode } from "graphql-typed";
export namespace GetUserActivitiesQueryPartialData {
  export interface AddressHistories {
    __typename?: "addressHistoriesResponse" | null;
    address?: string | null;
    blockNumber?: number | null;
    count?: number | null;
    createdAt?: number | null;
    event?: string | null;
    from?: string | null;
    id?: string | null;
    transactionHash?: string | null;
    type?: string | null;
    typeId?: string | null;
    value?: number | null;
  }
}
export interface GetUserActivitiesQueryPartialData {
  addressHistories?: (GetUserActivitiesQueryPartialData.AddressHistories | null)[] | null;
}
export namespace GetUserActivitiesQueryData {
  export interface Variables {
    first?: number | null;
    skip?: number | null;
    orderBy?: string | null;
    orderDirection?: string | null;
    address: string;
    event_in?: (string | null)[] | null;
  }
  export interface AddressHistories {
    __typename: "addressHistoriesResponse";
    address: string;
    blockNumber: number;
    count: number;
    createdAt: number;
    event: string;
    from: string;
    id: string;
    transactionHash: string;
    type: string;
    typeId: string;
    value: number;
  }
}
export interface GetUserActivitiesQueryData {
  addressHistories?: GetUserActivitiesQueryData.AddressHistories[] | null;
}
declare const document: DocumentNode<GetUserActivitiesQueryData, GetUserActivitiesQueryData.Variables, GetUserActivitiesQueryPartialData>;
export default document;