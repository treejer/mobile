import {colors} from 'constants/values';
import {isTheTimeToUpdate, isUpdatePended, SubmittedTreeStatus} from './treeInventory';
import {Hex2Dec} from 'utilities/helpers/hex';
import {TreeInList} from 'types';

export type TreeColorType = {
  [key in SubmittedTreeStatus]: {
    title: string;
    color: string;
  };
};

export const treeColorTypes: TreeColorType = {
  [SubmittedTreeStatus.Pending]: {
    title: 'pending',
    color: colors.pink,
  },
  [SubmittedTreeStatus.Verified]: {
    title: 'pending',
    color: colors.green,
  },
  [SubmittedTreeStatus.Update]: {
    title: 'update',
    color: colors.gray,
  },
};

export function treeColorV2(tree?: TreeInList, treeUpdateInterval?: number): string | undefined {
  let color: string | undefined;
  if (!treeUpdateInterval) {
    return;
  }
  if (!tree) {
    return colors.green;
  }
  const id = Number(Hex2Dec(tree?.id || ''));
  if (isUpdatePended(tree)) {
    color = treeColorTypes.Pending.color;
    return color;
  } else if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
    color = treeColorTypes.Update.color;
  } else {
    if (id <= 10000) {
      color = undefined;
    } else {
      color = colors.green;
    }
  }

  return color;
}

export function submittedTreeStatusCount(trees: TreeInList[] | null, treeUpdateInterval: number) {
  const defaultAcc = {
    [SubmittedTreeStatus.Update]: 0,
    [SubmittedTreeStatus.Pending]: 0,
    [SubmittedTreeStatus.Verified]: 0,
  };

  return trees
    ? trees?.reduce((acc, tree) => {
        if (isUpdatePended(tree)) {
          return {
            ...acc,
            [SubmittedTreeStatus.Pending]: acc[SubmittedTreeStatus.Pending] + 1,
          };
        } else if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
          return {
            ...acc,
            [SubmittedTreeStatus.Update]: acc[SubmittedTreeStatus.Update] + 1,
          };
        } else {
          return {
            ...acc,
            [SubmittedTreeStatus.Verified]: acc[SubmittedTreeStatus.Verified] + 1,
          };
        }
      }, defaultAcc)
    : defaultAcc;
}
