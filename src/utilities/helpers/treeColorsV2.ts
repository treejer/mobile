import {colors} from 'constants/values';
import {SubmittedTreeStatus} from './treeInventory';
import {Hex2Dec} from 'utilities/helpers/hex';
import {SubmittedTree} from 'webServices/trees/submittedTrees';

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
  [SubmittedTreeStatus.CanUpdate]: {
    title: 'update',
    color: colors.gray,
  },
  [SubmittedTreeStatus.Assigned]: {
    title: 'assigned',
    color: colors.red,
  },
};

export function treeColorV2(tree?: SubmittedTree): string | undefined {
  let color: string | undefined;
  const id = Number(Hex2Dec(tree?.id || ''));
  if (tree?.status == SubmittedTreeStatus.Pending) {
    color = colors.pink;
  } else if (tree?.status === SubmittedTreeStatus.Verified) {
    color = treeColorTypes.Verified.color;
    return color;
  } else if (tree?.status === SubmittedTreeStatus.CanUpdate) {
    color = treeColorTypes.CanUpdate.color;
  } else {
    if (id <= 10000) {
      color = undefined;
    } else {
      color = colors.green;
    }
  }

  return color;
}
