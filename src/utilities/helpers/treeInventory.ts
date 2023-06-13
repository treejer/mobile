import {colors} from 'constants/values';
import {SubmittedTree} from 'webServices/trees/submittedTrees';

export enum TreeLife {
  Submitted = 'Submitted',
  NotVerified = 'NotVerified',
  Drafted = 'Drafted',
}

export enum SubmittedTreeStatus {
  Pending = 'Pending',
  Verified = 'Verified',
  CanUpdate = 'CanUpdate',
  Assigned = 'Assigned',
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
    {
      title: SubmittedTreeStatus.Pending,
      t: 'submittedFilters',
      count: countOf?.Pending,
      color: colors.pink,
    },
    {
      title: SubmittedTreeStatus.CanUpdate,
      t: 'submittedFilters',
      count: countOf?.CanUpdate,
      color: colors.gray,
    },
    {
      title: SubmittedTreeStatus.Assigned,
      t: 'submittedFilters',
      count: countOf?.Assigned,
      color: colors.red,
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

export function handleFilterSubmittedTrees(trees: SubmittedTree[], filters: SubmittedTreeStatus[]) {
  return trees.filter(tree => {
    if (!filters.length) return tree;
    return tree?.status === filters[0];
  });
}
