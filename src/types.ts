import {TreeJourney} from 'screens/TreeSubmission/types';
import {TreeDetailQueryQueryData} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import {Routes} from 'navigation/index';
import {TreeLife, TreeSituation} from 'utilities/helpers/treeInventory';

export type Tree = TreeDetailQueryQueryData.Tree;

export interface MainTabsParamList extends Record<string, any> {
  Profile: undefined;
  TreeSubmission: undefined;
  GreenBlock: {
    greenBlockIdToJoin?: string;
    shouldNavigateToTreeDetails: boolean;
    filter?: TreeFilter;
    tabFilter?: TreeLife;
    situationFilter?: TreeSituation;
  };
  Activity: {
    filters: string[];
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
    tree_id: string;
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
  [Routes.SelectPlantType]?: {
    initialRouteName: string;
  };
  [Routes.SelectModels]: undefined;
  [Routes.CreateModel]: undefined;
  [Routes.SelectPhoto]: undefined;
  [Routes.SubmitTree]: undefined;
  [Routes.SelectOnMap]: {
    journey: TreeJourney;
  };
}

export interface ProfileRouteParamList extends Record<string, any> {
  NoWallet: undefined;
  MyProfile: {
    hideVerification?: boolean;
  };
  VerifyProfile: undefined;
  SelectWallet: undefined;
  SelectLanguage: {
    back: boolean;
  };
  Settings: undefined;
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
