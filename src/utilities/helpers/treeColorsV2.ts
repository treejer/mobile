import {ImageSourcePropType} from 'react-native';
import {Tree} from 'types';
import humanize from 'humanize-duration';

import {colors} from 'constants/values';
import {currentTimestamp} from 'utilities/helpers/date';
import {TreeStatus} from 'utilities/helpers/treeInventory';
import {Hex2Dec} from 'utilities/helpers/hex';
import {TreeImage} from '../../../assets/icons';

export function treeImageSrc(tree?: Tree): ImageSourcePropType {
  const imageFs = tree?.treeSpecsEntity?.imageFs;
  return imageFs ? {uri: imageFs} : TreeImage;
}

export type TreeColorType = {
  [key in TreeStatus]: {
    title: string;
    color: string;
  };
};

export const treeColorTypes: TreeColorType = {
  [TreeStatus.NotVerified]: {
    title: 'pending',
    color: colors.yellow,
  },
  [TreeStatus.Pending]: {
    title: 'pending',
    color: colors.pink,
  },
  [TreeStatus.Verified]: {
    title: 'pending',
    color: colors.green,
  },
  [TreeStatus.Update]: {
    title: 'update',
    color: colors.gray,
  },
};

export function treeColorV2(tree?: Tree, treeUpdateInterval?: number): string | undefined {
  let color: string | undefined;
  if (!treeUpdateInterval) {
    return;
  }
  if (!tree) {
    return colors.green;
  }
  const id = Number(Hex2Dec(tree?.id || ''));
  // if (id >= 0 && id <= 10) {
  //   color = colors.claimable;
  // } else if (id >= 11 && id <= 100) {
  //   color = colors.pink;
  // } else {
  //   color = colors.claimed;
  // }
  if (tree?.treeStatus?.toString() === '3') {
    color = treeColorTypes.NotVerified.color;
    return color;
  } else if (isUpdatePended(tree)) {
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

export function treeStatusCount(trees: Tree[] | null, treeUpdateInterval: number) {
  const defaultAcc = {
    [TreeStatus.Update]: 0,
    [TreeStatus.Pending]: 0,
    [TreeStatus.Verified]: 0,
    [TreeStatus.NotVerified]: 0,
  };

  return trees
    ? trees?.reduce((acc, tree) => {
        const id = Number(Hex2Dec(tree?.id || ''));
        if (tree?.treeStatus?.toString() === '3') {
          return {
            ...acc,
            [TreeStatus.NotVerified]: acc[TreeStatus.NotVerified] + 1,
          };
        } else if (isUpdatePended(tree)) {
          return {
            ...acc,
            [TreeStatus.Pending]: acc[TreeStatus.Pending] + 1,
          };
        } else if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
          return {
            ...acc,
            [TreeStatus.Update]: acc[TreeStatus.Update] + 1,
          };
        } else {
          return {
            ...acc,
            [TreeStatus.Verified]: acc[TreeStatus.Verified] + 1,
          };
        }
      }, defaultAcc)
    : defaultAcc;
}

export function isUpdatePended(tree: Tree): boolean {
  return tree?.lastUpdate?.updateStatus?.toString() === '1';
}

export function diffUpdateTime(tree: Tree, treeUpdateInterval: number | string): number {
  const differUpdateTime =
    Number(tree?.plantDate) + Number((tree?.treeStatus || 0) * 3600 + Number(treeUpdateInterval));
  return currentTimestamp() - differUpdateTime;
  // if (return < 0) {Last update is pending} else {can update}
}

export function isTheTimeToUpdate(tree: Tree, treeUpdateInterval: number | string): boolean {
  return diffUpdateTime(tree, treeUpdateInterval) >= 0;
}

export function treeDiffUpdateHumanized(diff: number, language = 'en') {
  return humanize(diff * 1000, {language});
}
