/* eslint-disable @shopify/strict-component-boundaries */
import {TreeJourney} from 'screens/TreeSubmission/types';
import {TreeDetailQueryQueryData} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {TreeFilter} from 'components/TreeList/TreeList';

export type Tree = TreeDetailQueryQueryData.Tree;

export interface MainTabsParamList extends Record<string, any> {
  Profile: undefined;
  TreeSubmission: undefined;
  GreenBlock: {
    greenBlockIdToJoin?: string;
    shouldNavigateToTreeDetails: boolean;
    filter?: TreeFilter;
  };
}

export interface GreenBlockRouteParamList extends Record<string, any> {
  CreateGreenBlock: undefined;
  MyCommunity: {
    shouldNavigateToTreeDetails: boolean;
  };
  AcceptInvitation: {
    greenBlockId: string;
  };
  TreeDetails: {
    tree?: Tree;
    treeJourney?: TreeJourney;
    offline?: boolean;
  };
  TreeUpdate: {
    treeIdToUpdate: string;
    location: {
      latitude: number;
      longitude: number;
    };
    initialRouteName?: string;
  };
  TreeList: undefined;
}

export interface TreeSubmissionRouteParamList extends Record<string, any> {
  SelectPlantType: {
    journey: TreeJourney;
  };
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
  SelectLanguage: {
    back: boolean;
  };
}

export interface PlanterJoinJourney {
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PlanterJoinList extends Record<string, any> {
  SelectOnMapJoinPlanter: {
    journey: PlanterJoinJourney;
  };
}
