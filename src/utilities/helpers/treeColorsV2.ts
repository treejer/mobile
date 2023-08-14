import {colors} from 'constants/values';
import {isTheTimeToUpdate, isUpdatePended, SubmittedTreeStatus} from './treeInventory';
import {Hex2Dec} from 'utilities/helpers/hex';
import {Tree} from 'types';

export type TreeColorType = {
  [key in SubmittedTreeStatus]: {
    title: string;
    color: string;
  };
};

export const treeColorTypes: TreeColorType = {
  [SubmittedTreeStatus.Verified]: {
    title: 'pending',
    color: colors.green,
  },
  [SubmittedTreeStatus.Update]: {
    title: 'update',
    color: colors.gray,
  },
};

export function treeColorV2(tree?: Tree, treeUpdateInterval?: number): string | undefined {
  let color: string | undefined;
  const id = Number(Hex2Dec(tree?.id || ''));
  if (id <= 10000) {
    color = undefined;
    return color;
  }
  if (isUpdatePended(tree)) {
    color = colors.pink;
  } else if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
    color = treeColorTypes.Update.color;
  } else {
    // marketplace || planted by model
    color = colors.green;
  }

  return color;
}
