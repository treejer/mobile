import {Routes} from 'navigation/index';
import {TreeDetailQueryQueryData} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {PlanterTreesQueryQueryPartialData} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {TreeLife, SubmittedTreeStatus, NotVerifiedTreeStatus} from 'utilities/helpers/treeInventory';

export type Tree = TreeDetailQueryQueryData.Tree;
export type TreeInList = PlanterTreesQueryQueryPartialData.Trees;

export enum TreeStatus {
  PENDING = 1,
  VERIFIED = 2,
  REJECTED = 3,
  DELETE = 4,
}

export type NotVerifiedTree = {
  _id: string;
  signer: string;
  nonce: number;
  treeSpecs: string;
  treeSpecsJSON: string;
  birthDate?: number;
  countryCode?: number;
  treeId?: number;
  status: TreeStatus;
  createdAt: string;
  updatedAt: string;
};
export interface MainTabsParamList extends Record<string, any> {
  Profile: undefined;
  TreeSubmission: undefined;
  GreenBlock: {
    greenBlockIdToJoin?: string;
    shouldNavigateToTreeDetails: boolean;
    filter?: TreeFilter;
    tabFilter?: TreeLife;
    notVerifiedFilter?: NotVerifiedTreeStatus[];
    submittedFilter?: SubmittedTreeStatus[];
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
  NotVerifiedTreeDetails: {
    tree: NotVerifiedTree;
    tree_id?: string;
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
