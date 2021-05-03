/* eslint-disable @shopify/strict-component-boundaries */
import {TreeJourney} from 'screens/TreeSubmission/types';

import {TreesQueryQueryData} from './screens/GreenBlock/screens/MyCommunity/graphql/TreesQuery.graphql';

export type Tree = TreesQueryQueryData.TreesTreesData;

export interface MainTabsParamList extends Record<string, any> {
  Profile: undefined;
  TreeSubmission: undefined;
  GreenBlock: {
    greenBlockIdToJoin?: string;
    goTree: boolean;
  };
}

export interface GreenBlockRouteParamList extends Record<string, any> {
  CreateGreenBlock: undefined;
  MyCommunity: {
    goTree: boolean;
  };
  AcceptInvitation: {
    greenBlockId: string;
  };
  TreeDetails: {
    tree: Tree;
  };
  TreeUpdate: {
    treeIdToUpdate: string;
  };
}

export interface TreeSubmissionRouteParamList extends Record<string, any> {
  SelectPhoto: {
    journey: TreeJourney;
  };
  SelectOnMap: {
    journey: TreeJourney;
  };
  SubmitTree: {
    journey: TreeJourney;
  };
}

export interface ProfileRouteParamList extends Record<string, any> {
  NoWallet: undefined;
  MyProfile: undefined;
  VerifyProfile: undefined;
  SelectWallet: undefined;
}
