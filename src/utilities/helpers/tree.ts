import {ImageSourcePropType} from 'react-native';
import {Tree, TreeInList} from 'types';

import {Hex2Dec} from 'utilities/helpers/hex';
import {colors} from 'constants/values';
import {currentTimestamp} from 'utilities/helpers/date';
import humanize from 'humanize-duration';
import {TreeImage} from '../../../assets/icons';

export function treeImageSrc(tree?: Omit<Tree | TreeInList, '__typename'>): ImageSourcePropType {
  const imageFs = tree?.treeSpecsEntity?.imageFs;
  return imageFs ? {uri: imageFs} : TreeImage;
}

export enum TreeColorStatus {
  NOT_VERIFIED = 'NOT_VERIFIED',
  PENDING = 'PENDING',
  UPDATE = 'UPDATE',
}

export type TreeColorType = {
  [key in TreeColorStatus]: {
    title: string;
    color: string;
  };
};

export const treeColorTypes: TreeColorType = {
  [TreeColorStatus.NOT_VERIFIED]: {
    title: 'notVerified',
    color: colors.yellow,
  },
  [TreeColorStatus.PENDING]: {
    title: 'pending',
    color: colors.pink,
  },
  [TreeColorStatus.UPDATE]: {
    title: 'update',
    color: colors.gray,
  },
};

export function treeColor(tree?: Tree, treeUpdateInterval?: number): string | undefined {
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
    color = treeColorTypes.NOT_VERIFIED.color;
    return color;
  } else if (isUpdatePended(tree)) {
    color = treeColorTypes.PENDING.color;
    return color;
  } else if (isTheTimeToUpdate(tree, treeUpdateInterval)) {
    color = treeColorTypes.UPDATE.color;
  } else {
    if (id <= 10000) {
      color = undefined;
    } else {
      color = colors.green;
    }
  }

  return color;
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
