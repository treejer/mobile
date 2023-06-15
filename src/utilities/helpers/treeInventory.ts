import humanize from 'humanize-duration';
import {colors} from 'constants/values';
import {Tree} from 'types';
import {currentTimestamp} from 'utilities/helpers/date';

export enum TreeLife {
  Submitted = 'Submitted',
  NotVerified = 'NotVerified',
  Drafted = 'Drafted',
}

export enum SubmittedTreeStatus {
  // Pending = 'Pending',
  Verified = 'Verified',
  CanUpdate = 'CanUpdate',
  // Assigned = 'Assigned',
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

export function submittedTreesButtons(countOf?: {[key in SubmittedTreeStatus]: number}) {
  return [
    {
      title: SubmittedTreeStatus.Verified,
      t: 'submittedFilters',
      count: countOf?.Verified,
      color: colors.green,
    },
    // {
    //   title: SubmittedTreeStatus.Pending,
    //   t: 'submittedFilters',
    //   count: countOf?.Pending,
    //   color: colors.pink,
    // },
    {
      title: SubmittedTreeStatus.CanUpdate,
      t: 'submittedFilters',
      count: countOf?.CanUpdate,
      color: colors.gray,
    },
  ];
}

export function notVerifiedTreesButtons(countOf: {[key in NotVerifiedTreeStatus]: number}) {
  return [
    {
      title: NotVerifiedTreeStatus.Plant,
      t: 'notVerifiedFilters',
      count: countOf.Plant,
      color: colors.yellow,
    },
    {
      title: NotVerifiedTreeStatus.Update,
      t: 'notVerifiedFilters',
      count: countOf?.Update,
      color: colors.pink,
    },
    {
      title: NotVerifiedTreeStatus.Assigned,
      t: 'notVerifiedFilters',
      count: countOf?.Assigned,
      color: colors.red,
    },
  ];
}

export function isUpdatePended(tree?: Tree): boolean {
  return tree?.lastUpdate?.updateStatus?.toString() === '1';
}

export function diffUpdateTime(tree?: Tree, treeUpdateInterval?: number | string): number {
  const differUpdateTime =
    Number(tree?.plantDate) + Number(((tree?.treeStatus as any) || 0) * 3600 + Number(treeUpdateInterval));
  console.log({differUpdateTime});
  return currentTimestamp() - differUpdateTime;
  // if (return < 0) {Last update is pending} else {can update}
}

export function isTheTimeToUpdate(tree?: Tree, treeUpdateInterval?: number | string): boolean {
  return diffUpdateTime(tree, treeUpdateInterval) >= 0;
}

export function treeDiffUpdateHumanized(diff: number, language = 'en') {
  return humanize(diff * 1000, {language});
}

export function handleFilterSubmittedTrees(trees: Tree[], filters: SubmittedTreeStatus[], treeUpdateInterval: number) {
  return trees.filter(tree => {
    if (!filters.length) return tree;
    if (filters.includes(SubmittedTreeStatus.Verified)) {
      if (!(isUpdatePended(tree) || isTheTimeToUpdate(tree, treeUpdateInterval))) {
        return tree;
      }
    }
    if (filters.includes(SubmittedTreeStatus.CanUpdate)) {
      if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
        return tree;
      }
    }
  });
}
