import humanize from 'humanize-duration';
import {colors} from 'constants/values';
import {PlanterTreesQueryQueryPartialData} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {TreeInList} from 'types';
import {currentTimestamp} from 'utilities/helpers/date';

export enum TreeLife {
  Submitted = 'Submitted',
  NotVerified = 'NotVerified',
  Drafted = 'Drafted',
}

export enum SubmittedTreeStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  Update = 'Update',
}

export enum NotVerifiedTreeStatus {
  Plant = 'Plant',
  Assigned = 'Assigned',
  Update = 'Update',
}

export const treeInventoryTabs = [
  {
    title: TreeLife.Submitted,
    icon: 'clipboard-check',
  },
  {
    title: TreeLife.NotVerified,
    icon: 'clock',
  },
  {
    title: TreeLife.Drafted,
    icon: 'cloud-upload-alt',
  },
];

export function submittedTreesButtons(countOf: {[key in SubmittedTreeStatus]: number}) {
  return [
    {
      title: SubmittedTreeStatus.Verified,
      count: countOf?.Verified,
      color: colors.green,
    },
    {
      title: SubmittedTreeStatus.Pending,
      count: countOf?.Pending,
      color: colors.pink,
    },
    {
      title: SubmittedTreeStatus.Update,
      count: countOf?.Update,
      color: colors.gray,
    },
  ];
}

export function notVerifiedTreesButtons(countOf: {[key in NotVerifiedTreeStatus]: number}) {
  return [
    {
      title: NotVerifiedTreeStatus.Plant,
      count: countOf.Plant,
      color: colors.yellow,
    },
    {
      title: NotVerifiedTreeStatus.Update,
      count: countOf?.Update,
      color: colors.pink,
    },
    {
      title: NotVerifiedTreeStatus.Assigned,
      count: countOf?.Assigned,
      color: colors.red,
    },
  ];
}

export function isUpdatePended(tree: TreeInList): boolean {
  return tree?.lastUpdate?.updateStatus?.toString() === '1';
}

export function diffUpdateTime(tree: TreeInList, treeUpdateInterval: number | string): number {
  const differUpdateTime =
    Number(tree?.plantDate) + Number(((tree?.treeStatus as any) || 0) * 3600 + Number(treeUpdateInterval));
  return currentTimestamp() - differUpdateTime;
  // if (return < 0) {Last update is pending} else {can update}
}

export function isTheTimeToUpdate(tree: TreeInList, treeUpdateInterval: number | string): boolean {
  return diffUpdateTime(tree, treeUpdateInterval) >= 0;
}

export function treeDiffUpdateHumanized(diff: number, language = 'en') {
  return humanize(diff * 1000, {language});
}

export function handleFilterSubmittedTrees(
  trees: PlanterTreesQueryQueryPartialData.Trees[],
  filters: SubmittedTreeStatus[],
  treeUpdateInterval: number,
) {
  return trees.filter(tree => {
    if (!filters.length) return tree;
    if (filters.includes(SubmittedTreeStatus.Verified)) {
      if (!(isUpdatePended(tree) || isTheTimeToUpdate(tree, treeUpdateInterval))) {
        return tree;
      }
    }
    if (filters.includes(SubmittedTreeStatus.Pending)) {
      if (isUpdatePended(tree)) {
        return tree;
      }
    }
    if (filters.includes(SubmittedTreeStatus.Update)) {
      if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
        return tree;
      }
    }
  });
}
